import {
    generateLinkerValuesFromCookies,
    getLinkerValuesFromUrl,
    decorateAnchorTagWithLinker,
    decorateFormTagWithLinker,
    decorateURLWithLinker,
    getFingerPrint
} from "./utils.js";

/**
 * @function getLinker
 * @param {object} [settings={}] - the settings object
 * @param {(string|RegExp)[]|object} settings.cookiesNamesList - an array with the cookies names to be passed on the linker, or an object with the cookies names and values
 * @param {string} settings.gaCookiesPrefix - prefix for the Google Analytics cookies
 * @param {string} settings.conversionLinkerCookiesPrefix - prefix to use when looking for Conversion Linker (Google Ads, Campaign Manager) cookies.
 * @returns {string} - the linker parameter. Example: 1*dm649n*_ga*MTM2MDM4NDg1MS4xNjYxODIxMjQy*_ga_THYNGSTER*XXXXXXXXXXXXXXX*_gcl_aw*AAAAAAAAAAAA*_gcl_dc*BBBBBBBBBBB*_gcl_gb*CCCCCCCCCCCC*_gcl_gf*DDDDDDDDDDD*_gcl_ha*EEEEEEEEEEEE*_fplc*MTExMTExMTExMTExMTExMTExMTEx
 */
export function getLinker({
    cookiesNamesList,
    gaCookiesPrefix,
    conversionLinkerCookiesPrefix
} = {}) {
    const linkerCookiesValues = generateLinkerValuesFromCookies({
        cookiesNamesList,
        gaCookiesPrefix,
        conversionLinkerCookiesPrefix
    });

    return ["1", getFingerPrint(linkerCookiesValues), linkerCookiesValues.join("*")].join("*");
}

/**
 * @function readLinker
 * @param {object} [settings={}] - the settings object
 * @param {string} settings.linkerQueryParameterName - the parameter name of the linker in the URL
 * @param {boolean} settings.checkFingerPrint - if the function should check for the fingerprint validation before returning the cookies
 * @returns {object|undefined} - an object with the cookies values, or undefined if the linker parameter is not found or the fingerprint check failed
 */
export function readLinker({ linkerQueryParameterName, checkFingerPrint } = {}) {
    return getLinkerValuesFromUrl({
        linkerQueryParameterName,
        checkFingerPrint
    });
}

/**
 * @function decorateWithLinker
 * @param {object} [settings={}] - the settings object
 * @param {string} settings.linkerQueryParameterName - the parameter name of the linker in the URL
 * @param {(string|RegExp)[]|object} settings.cookiesNamesList - an array with the cookies names to be passed on the linker, or an object with the cookies names and values
 * @param {string} settings.gaCookiesPrefix - prefix for the Google Analytics cookies
 * @param {string} settings.conversionLinkerCookiesPrefix - prefix to use when looking for Conversion Linker (Google Ads, Campaign Manager) cookies.
 * @param {(HTMLAnchorElement|HTMLFormElement|string)[]|NodeList<HTMLAnchorElement|HTMLFormElement>|HTMLAnchorElement|HTMLFormElement|string} settings.entity - the entity (<a>, <form> or an URL) to be decorated or an array with the entities (<a>, <form> or an URL) or a NodeList with the entities (<a> or <form>)
 * @param {boolean} settings.useFragment - whether to place the linker parameter in the fragment part of the URL or in the query string
 * @returns {HTMLAnchorElement|HTMLFormElement|string|undefined} - the entity (<a>, <form> or an URL) decorated with the linker parameter
 */
export function decorateWithLinker({
    linkerQueryParameterName,
    cookiesNamesList,
    gaCookiesPrefix,
    conversionLinkerCookiesPrefix,
    entity,
    useFragment
} = {}) {
    const elementsDecorated = [];
    const linkerParameter = getLinker({
        cookiesNamesList,
        gaCookiesPrefix,
        conversionLinkerCookiesPrefix
    });

    if (!Array.isArray(entity) && !(entity instanceof NodeList)) {
        entity = [entity];
    }

    entity.forEach((elementToDecorate) => {
        let elementDecorated;
        if (elementToDecorate.tagName) {
            if ("A" === elementToDecorate.tagName) {
                elementDecorated = decorateAnchorTagWithLinker(
                    linkerQueryParameterName,
                    linkerParameter,
                    elementToDecorate,
                    useFragment
                );
            } else if ("FORM" === elementToDecorate.tagName) {
                elementDecorated = decorateFormTagWithLinker(
                    linkerQueryParameterName,
                    linkerParameter,
                    elementToDecorate
                );
            }
        } else if ("string" === typeof elementToDecorate) {
            elementDecorated = decorateURLWithLinker(
                linkerQueryParameterName,
                linkerParameter,
                elementToDecorate,
                useFragment
            );
        }

        if (elementDecorated) {
            elementsDecorated.push(elementDecorated);
        }
    });

    return elementsDecorated.length ? elementsDecorated : undefined;
}
