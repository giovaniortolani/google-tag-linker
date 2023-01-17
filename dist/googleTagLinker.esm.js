const urlChecker = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;

function getCookieNameAndValue(cookieName) {
    const cookiesNamesAndValues = ("; " + document.cookie).split("; ");
    for (let i = cookiesNamesAndValues.length - 1; i >= 0; i--) {
        const cookieNameAndValue = cookiesNamesAndValues[i].split("=");
        const cookieFound =
            cookieName instanceof RegExp
                ? cookieName.test(cookieNameAndValue[0])
                : cookieName === cookieNameAndValue[0];
        if (cookieFound) return [cookieNameAndValue[0], cookieNameAndValue[1]];
    }
    return [];
}

function transformCookieNameAndValueToLinkerFormat(cookieName, cookieValue) {
    return [cookieName, window.btoa(cookieValue).replace(/=/g, ".")].join("*");
}

function untransformCookieValueFromLinkerFormat(cookieValue) {
    return window.atob(cookieValue.replace(/\./g, "="));
}

function getQueryParameterValue(parameterName) {
    const url = window.location.href;

    const reg = new RegExp("[?&]" + parameterName + "=([^&#]*)", "i");
    const result = reg.exec(url);
    return result === null ? null : decodeURIComponent(result[1]);
    // const searchParams = new URLSearchParams(url);
    // return searchParams.get(parameterName);
}

function getLinkerValuesFromUrl({
    linkerQueryParameterName,
    cookiesNamesList,
    checkFingerPrint
} = {}) {
    const linkerParameterValue = getQueryParameterValue(linkerQueryParameterName);
    if (!linkerParameterValue) return;

    if (checkFingerPrint) {
        const linkerFingerprint = linkerParameterValue.split("*")[1];
        const linkerCookiesValues = generateLinkerValuesFromCookies({
            cookiesNamesList // Must be the same as the ones used to generate the Linker parameter
        });
        const currentFingerprint = getFingerPrint(linkerCookiesValues);
        if (linkerFingerprint !== currentFingerprint) return;
    }

    const cookiesEncodedFromLinkerParameter = linkerParameterValue.split("*").slice(2);
    const cookiesDecodedFromUrl = {};
    for (let i = 0; i < cookiesEncodedFromLinkerParameter.length; i += 2) {
        const cookieName = cookiesEncodedFromLinkerParameter[i];
        const cookieValue = cookiesEncodedFromLinkerParameter[i + 1];
        cookiesDecodedFromUrl[cookieName] = untransformCookieValueFromLinkerFormat(cookieValue);
    }

    return cookiesDecodedFromUrl;
}

function generateLinkerValuesFromCookies({ cookiesNamesList } = {}) {
    const cookiesValuesFormmatedForLinker = [];
    let _FPLC = undefined;

    cookiesNamesList.forEach(function (cookieName) {
        let cookieValue;
        [cookieName, cookieValue] = getCookieNameAndValue(cookieName);
        if (!cookieValue) return; // Proceed to next iteration.
        if (/^_ga/.test(cookieName)) {
            cookieValue = cookieValue.match(/G[A-Z]1\.[0-9]\.(.+)/)[1];
        } else if (cookieName === "FPLC") {
            _FPLC = cookieValue;
        }
        cookiesValuesFormmatedForLinker.push(
            transformCookieNameAndValueToLinkerFormat(cookieName, cookieValue)
        );
    });

    // This needs to go at the end
    if (_FPLC)
        cookiesValuesFormmatedForLinker.push(
            transformCookieNameAndValueToLinkerFormat("_fplc", _FPLC)
        );

    return cookiesValuesFormmatedForLinker;
}

function decorateAnchorTagWithLinker(
    linkerQueryParameter,
    linkerParameter,
    anchorElement,
    useFragment
) {
    if (anchorElement.href) {
        const decoratedUrl = (linkerParameter = decorateURLWithLinker(
            linkerQueryParameter,
            linkerParameter,
            anchorElement.href,
            useFragment
        ));
        urlChecker.test(decoratedUrl) && (anchorElement.href = decoratedUrl);
    }
}

function decorateFormTagWithLinker(linkerQueryParameter, linkerParameter, formElement) {
    if (formElement && formElement.action) {
        const method = (formElement.method || "").toLowerCase();
        if ("get" === method) {
            const childNodes = formElement.childNodes || [];
            for (let found = false, i = 0; i < childNodes.length; i++) {
                const childNode = childNodes[i];
                if (childNode.name === linkerQueryParameter) {
                    childNode.setAttribute("value", linkerParameter);
                    found = true;
                    break;
                }
            }
            if (!found) {
                const childNode = document.createElement("input");
                childNode.setAttribute("type", "hidden");
                childNode.setAttribute("name", linkerQueryParameter);
                childNode.setAttribute("value", linkerParameter);
                formElement.appendChild(childNode);
            }
        } else if ("post" === method) {
            const decoratedUrl = decorateURLWithLinker(
                linkerQueryParameter,
                linkerParameter,
                formElement.action
            );
            urlChecker.test(decoratedUrl) && (formElement.action = decoratedUrl);
        }
    }
}

function decorateURLWithLinker(linkerQueryParameter, linkerParameter, url, useFragment) {
    function Q(a) {
        return new RegExp("(.*?)(^|&)" + a + "=([^&]*)&?(.*)");
    }

    function U(a, b) {
        if ((a = Q(a).exec(b))) {
            var c = a[2],
                d = a[4];
            b = a[1];
            d && (b = b + c + d);
        }
        return b;
    }

    function e(k) {
        k = U(linkerQueryParameter, k);
        var m = k.charAt(k.length - 1);
        k && "&" !== m && (k += "&");
        return k + g;
    }

    useFragment = !!useFragment;
    var urlParsedIntoParts = /([^?#]+)(\?[^#]*)?(#.*)?/.exec(url);
    if (!urlParsedIntoParts) return "";
    const hostname = urlParsedIntoParts[1];
    const queryString = urlParsedIntoParts[2] || "";
    const fragment = urlParsedIntoParts[3] || "";
    var g = linkerQueryParameter + "=" + linkerParameter;
    useFragment
        ? (fragment = "#" + e(fragment.substring(1)))
        : (queryString = "?" + e(queryString.substring(1)));
    return "" + hostname + queryString + fragment;
}

// linkerCookiesValues argument is an array in the following format ['<cookie name 1>*<cookie value transformed 1>', ...]
function getFingerPrint(linkerCookiesValues = undefined) {
    // Build Finger Print String
    const fingerPrintString = [
        window.navigator.userAgent,
        new Date().getTimezoneOffset(),
        window.navigator.userLanguage || window.navigator.language,
        Math.floor(new Date().getTime() / 60 / 1e3) - 0,
        linkerCookiesValues ? linkerCookiesValues.join("*") : ""
    ].join("*");

    // Make a CRC Table
    let c;
    const crcTable = [];
    for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        crcTable[n] = c;
    }
    // Create a CRC32 Hash
    let crc = 0 ^ -1;
    for (let i = 0; i < fingerPrintString.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ fingerPrintString.charCodeAt(i)) & 0xff];
    }
    // Convert the CRC32 Hash to Base36 and return the value
    crc = ((crc ^ -1) >>> 0).toString(36);
    return crc;
}

function getLinker({ cookiesNamesList } = {}) {
    // Grab current GA4 and Google Ads / Campaign Manager Related cookies
    const linkerCookiesValues = generateLinkerValuesFromCookies({
        cookiesNamesList
    });

    return ["1", getFingerPrint(linkerCookiesValues), linkerCookiesValues.join("*")].join("*");
}

function readLinker({ linkerQueryParameterName, cookiesNamesList, checkFingerPrint } = {}) {
    return getLinkerValuesFromUrl({
        linkerQueryParameterName,
        cookiesNamesList,
        checkFingerPrint
    });
}

function decorateWithLinker({
    linkerQueryParameterName,
    cookiesNamesList,
    entity,
    useFragment
} = {}) {
    const linkerParameter = getLinker({
        cookiesNamesList
    });

    if (entity.tagName) {
        if ("A" === entity.tagName)
            return decorateAnchorTagWithLinker(
                linkerQueryParameterName,
                linkerParameter,
                entity,
                useFragment
            );
        if ("FORM" === entity.tagName)
            return decorateFormTagWithLinker(linkerQueryParameterName, linkerParameter, entity);
    }

    if ("string" === typeof entity)
        return decorateURLWithLinker(
            linkerQueryParameterName,
            linkerParameter,
            entity,
            useFragment
        );
}

/*

[x] Add Adwords / Double Click Support
    [x] Confirmar quais são os cookies usados para esse caso.
        '_gcl_aw', '_gcl_dc', '_gcl_gf', '_gcl_ha', '_gcl_gb'
    [x] Colocar opção para pessoa escolher o prefixo do cookie (do GA e Conversion Linker). Alterar assinatura de getCookies.

[x] QA environments with multiple cookies
    [x] Ler somente o último cookie de document.cookies, pois será sempre o mais atualizado.
       O  código original pega sempre o último cookie.

[x] Add the chance to manually defined the cookies to be passed. Alterar assinatura de getCookies.
    [x] Se não passar nada, pega os default que o GA4 usa (_ga e _ga_<stream> e FPLC)

[x] Add a "read" method to decode the linkerParam to the real cookie values
    [x] Checar se fingerprint bate.
    [x] Se bater, pegar cada query e fazer atob(query.replace(/\./g, '='))

[x] Add a "decorate" method
    Usar a mesma ideia de window.google_tag_data.glBridge.decorate(generateArgumentObject, element);
    Checar no código o que é que fazem para cada caso.
    [x] Se for string, decora a string e retorna.
    [x] Se for HTMLAnchorElement ou HTMLFormElement, decora os atributos que contém o link e retorna (o próprio elemento ou a string. Checar.)


[x] Renomear getCookies e as variáveis que capturam o retorno. Alterar o nome do argumento de getFingerprint.


[x] Gerenciar argumentos default.

[] Testar "decorate".

[] Enviar para o Chat GPT
    [] Pedir para arrumar o readme.
    [] Solicitar que documente apenas 2 funções por vez. Assim dará para pegar todas.
    [] Pedir para gerar testes.

*/

const googleTagLinker = function (action = "get", settings = {}) {
    // Check if we are on a browser
    if (typeof window === "undefined" || typeof window.document === "undefined") {
        throw "This should be only run on a browser";
    }

    ({
        gaCookiesPrefix: settings.gaCookiesPrefix || undefined,
        conversionLinkerCookiesPrefix: settings.conversionLinkerCookiesPrefix || "_gcl",
        linkerQueryParameterName: settings.linkerQueryParameterName || "_gl",
        checkFingerPrint: settings.checkFingerPrint || false,
        useFragment: settings.useFragment || false
    });

    if (settings.cookiesNamesList) {
        settings.cookiesNamesList;
    }

    switch (action) {
        case "get":
            return getLinker({
                cookiesNamesList: settings.cookiesNamesList
            });
        case "read":
            return readLinker({
                linkerQueryParameterName: settings.linkerQueryParameterName,
                cookiesNamesList: settings.cookiesNamesList,
                checkFingerPrint: settings.checkFingerPrint
            });
        case "decorate":
            return decorateWithLinker({
                linkerQueryParameterName: settings.linkerQueryParameterName,
                cookiesNamesList: settings.cookiesNamesList,
                entity: settings.entity,
                useFragment: settings.useFragment
            });
    }
};

googleTagLinker.prototype = {};
googleTagLinker.answer = 42;

export { googleTagLinker as default };
