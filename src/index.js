import { getLinker, readLinker, decorateWithLinker } from "./actions.js";

/**
 * Main function to create and return the linker parameter for Google Tag cross-domain tracking.
 *
 * @function googleTagLinker
 *
 * @param {string|undefined} action - The action for the function to execute. Available options: "get", "read", "decorate". Default: "get".
 * @param {string|undefined} settings.gaCookiesPrefix - the prefix to use when looking for _ga cookies. Default: "".
 * @param {string|undefined} settings.conversionLinkerCookiesPrefix - the prefix to use when looking for Conversion Linker (Google Ads, Campaign Manager) cookies. Default: "_gcl".
 * @param {string|undefined} settings.linkerQueryParameterName - the query parameter name to use as the linker parameter. Default: "_gl".
 * @param {boolean|undefined} settings.checkFingerPrint - enable or disable checking the fingerprint of the linker parameter. Default: false.
 * @param {(HTMLAnchorElement|HTMLFormElement|string)[]|NodeList<HTMLAnchorElement|HTMLFormElement>|HTMLAnchorElement|HTMLFormElement|string} settings.entity - the entity (<a>, <form> or an URL) to be decorated or an array with the entities (<a>, <form> or an URL) or a NodeList with the entities (<a> or <form>).
 * @param {boolean|undefined} settings.useFragment - whether to place the linker parameter in the fragment part of the URL or in the query string. Default: false.
 * @param {(string|RegExp)[]|object|undefined} settings.cookiesNamesList - list of cookies names to include in the linker parameter or an object containing the cookies names and values. Default: ["_ga", /^_ga_[A-Z0-9]+$/, "FPLC", "_gcl_aw", "_gcl_dc", "_gcl_gb", _"gcl_gf", "_gcl_ha", "_gcl_au", "FPAU"].
 * @returns {HTMLAnchorElement|HTMLFormElement|string|undefined} Returns the linker parameter, the values read from the linker parameter, the entities decorated with the linker parameter or undefined.
 */
const googleTagLinker = function (action = "get", settings = {}) {
    // Check if we are on a browser
    if (typeof window === "undefined" || typeof window.document === "undefined") {
        throw "This should be only run on a browser";
    }

    const defaultSettings = {
        gaCookiesPrefix: settings.gaCookiesPrefix || "",
        conversionLinkerCookiesPrefix: settings.conversionLinkerCookiesPrefix || "_gcl",
        linkerQueryParameterName: settings.linkerQueryParameterName || "_gl",
        checkFingerPrint: !!settings.checkFingerPrint || false,
        useFragment: !!settings.useFragment || false
    };

    if (settings.cookiesNamesList) {
        defaultSettings.cookiesNamesList = settings.cookiesNamesList;
    } else {
        defaultSettings.cookiesNamesList = [
            // Main Google Analytics Cookie
            defaultSettings.gaCookiesPrefix + "_ga",

            // Google Analytics 4 Session Cookie (e.g. Data Stream ID is G-ABC123, the cookie will be <prefix>_ga_ABC123)
            new RegExp("^" + defaultSettings.gaCookiesPrefix + "_ga_[A-Z0-9]+$"),

            // First Party Linker Cookie maps to sGTM
            "FPLC",

            // First Party Advertiser User ID maps to sGTM (same purpose as _gcl_au)
            "FPAU"
        ];

        // Google Ads (gclid, gclsrc maps to _aw, _dc, _gf, _ha cookies)
        // Campaign Manager (dclid, gclsrc maps to _aw, _dc, _gf, _ha cookies)
        // wbraid (wbraid maps to _gb cookie)
        // gbraid (grabid maps to _ag cookie)
        // Advertising ID - value that is generated randomly and is used by Googe Ads tags to join with ad click data (_au cookie)
        ["_aw", "_dc", "_gb", "_ag", "_gf", "_ha", "_au"].forEach((name) => {
            defaultSettings.cookiesNamesList.push(
                defaultSettings.conversionLinkerCookiesPrefix + name
            );
        });
    }

    switch (action) {
        case "get":
            return getLinker({
                cookiesNamesList: defaultSettings.cookiesNamesList,
                gaCookiesPrefix: defaultSettings.gaCookiesPrefix,
                conversionLinkerCookiesPrefix: defaultSettings.conversionLinkerCookiesPrefix
            });
        case "read":
            return readLinker({
                linkerQueryParameterName: defaultSettings.linkerQueryParameterName,
                checkFingerPrint: defaultSettings.checkFingerPrint
            });
        case "decorate":
            return decorateWithLinker({
                linkerQueryParameterName: defaultSettings.linkerQueryParameterName,
                cookiesNamesList: defaultSettings.cookiesNamesList,
                gaCookiesPrefix: defaultSettings.gaCookiesPrefix,
                conversionLinkerCookiesPrefix: defaultSettings.conversionLinkerCookiesPrefix,
                entity: settings.entity,
                useFragment: defaultSettings.useFragment
            });
        default:
            break;
    }
};

googleTagLinker.prototype = {};
googleTagLinker.answer = 42;

export default googleTagLinker;
