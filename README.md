# Table of contents

- [Google Tag Linker Brigde](#google-tag-linker-brigde-and-any-other-analyticsmarketing-tools)
- [How does Google Tag cross-domain work](#how-does-google-tag-cross-domain-work)
- [Notes](#notes)
- [To-Do](#to-do)
- [Build](#build)
- [How to use](#how-to-use)
  * [Installation](#installation)
    + [Using `import`](#using-import)
    + [Loading a bundle files of `dist` folder via CDN](#loading-a-bundle-files-of-dist-folder-via-cdn)
    + [Self-hosting one of the bundle files of `dist` folder](#self-hosting-one-of-the-bundle-files-of-dist-folder)
  * [`get` method](#get-method)
    + [Example](#example)
  * [`read` method](#read-method)
    + [Example](#example-1)
  * [`decorate` method](#decorate-method)
    + [Example](#example-2)
- [Authors](#authors)

# Google Tag Linker Brigde (and any other analytics/marketing tools)

Hola! Olá! This is a **JavaScript** library that provided the needed functionality for creating a `linkerParam` for Google Analytics 4 (**_`Google Tag`_**, **_`GTAG`_**). I
It also works for any other analytics/marketing tools.

At the time of publishing this library, Google doesn't offer any "documented" way of generating this value, making really hard to work with custom implementations, for example when needing to deal with iFrames or forms/links generated dynamically.

The library is provided in the `AMD`, `UMD`, `IIFE`, and `ESM` formats, all of them available in the `dist` folder.

# How does Google Tag cross-domain work

Google Tag cross-domain works pretty similarly to how previous Google Analytics worked. It's basically based on 2 different parts.

1. A fingerprint (Browser/Time)
2. The list of cookies to be passed to the new domain

The fingerprinting is done using the following values:

- Navigator User Agent
- User Timezone
- Navigator Language
- Current Time (current minute index from EPOC TimeStamp Rounded)
- A list of cookies passed on the linker

The usage for this fingerprinting is not identifying the user, but making the current link only work on the current user's browser and making it valid only for the current minute (since many users may share the same browser specs).

The Linker Parameter will look like this:

    1*dm649n*_gcl_au*NTYwNjM5MjY2LjE3MDIwNDc1OTk.*FPAU*NTYwNjM5MjY2LjE3MDIwNDc1OTk.*_ga*MTM2MDM4NDg1MS4xNjYxODIxMjQy*_ga_THYNGSTER*XXXXXXXXXXXXXXX*_gcl_aw*AAAAAAAAAAAA*_gcl_dc*BBBBBBBBBBB*_gcl_gb*CCCCCCCCCCCC*_gcl_gf*DDDDDDDDDDD*_gcl_ha*EEEEEEEEEEEE*_fplc*MTExMTExMTExMTExMTExMTExMTEx

Which follows the following definition:

    {{FIXED_NUMBER}}*{{FINGERPRINT_HASH}}*[COOKIE_KEY*COOKIE_VALUE]^n

This tool will read and pass the following cookies by default:

| Cookie Name | Description |
| ----------- | ----------- |
| `({{prefix}})?`_ga | Universal and Google Analytics 4 Cookie |
| `({{prefix}})?`_ga_XXXXXX | Google Analytics 4 Session Cookie |
| `({{prefix}}\|_gcl)`_aw | Google Analytics Ads / Campaign Manager Cookies - gclid, dclid, gclsrc URL parameters |
| `({{prefix}}\|_gcl)`_dc | Google Analytics Ads / Campaign Manager Cookies - gclid, dclid, gclsrc URL parameters |
| `({{prefix}}\|_gcl)`_gb | Google Analytics Ads / Campaign Manager Cookies - gclid, dclid, gclsrc, wbraid URL parameters |
| `({{prefix}}\|_gcl)`_gf | Google Analytics Ads / Campaign Manager Cookies - gclid, dclid, gclsrc URL parameters  |
| `({{prefix}}\|_gcl)`_ha | Google Analytics Ads / Campaign Manager Cookies - gclid, dclid, gclsrc URL parameters |
| `({{prefix}}\|_gcl)`_au | Google Analytics Ads / Campaign Manager Cookies - Advertising ID - value that is generated randomly and is used by Ads tags to join data |
| FPAU | First Party Linker Cookie Advertising ID from sGTM (same as _gcl_au) |
| FPLC | First Party Linker Cookie from sGTM |

You can also specify a list of cookie names to be read or an object containing the cookie names (as keys) and cookie values (as values).

# Notes

This is a beta version, while it should work fine for doing GA4 cross-domain tracking. Check the next section.

When there are multiple GA4 session cookies, the code reads the last one present in `document.cookie` string, if it wasn't manually passed to the `googleTagLinker` function as an argument.

# To-Do

- [x] Add Adwords / Double Click Support
- [x] QA environments with multiple cookies
- [x] Add the chance to manually define the cookies to be passed
- [x] Add a "read" method to decode the linkerParam to the real cookie values
- [x] Add a "decorate" method
- [ ] Add tests
- [ ] Refactoring / TypeScript

# Build

```bash
$ npm install
$ npm run build
```

# How to use

## Installation

There are 3 options to run the script.

### Using `import`

```js
import googleTagLinker from '@giovaniortolanibarbosa/google-tag-linker';
const linkerParam = googleTagLinker("get");
```

### Loading a bundle files of `dist` folder via CDN
Choose your preferred version inside the `dist` folder.

```html
<script src="https://cdn.jsdelivr.net/npm/@giovaniortolanibarbosa/google-tag-linker@latest/dist/googleTagLinker.iife.min.js"></script>
<script>
    const linkerParam = googleTagLinker("get");
</script>
```

### Self-hosting one of the bundle files of `dist` folder
Keep in mind that **you will not receive updates**. This is a viable approach if you use GTM.
If installing via GTM, choose the `googleTagLinker.iife.min.js` version.

```html
<!--
Inside a Custom HTML tag in GTM, add your preferred minified version

Ensure that it fires before your product analytics or marketing analytics tool that will use the information appended in the query string (cross-domain).
To do that, add this tag as a setup tag of your tool.
-->

<script>
var googleTagLinker=function(){"use strict";var e=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;function r(e,r){return[e,window.btoa(r).replace(/=/g,".")].join("*")}function i(e){return window.atob(e.replace(/\./g,"="))}function n(e,r,i,n){function o(r){var i=(r=function(e,r){if(e=function(e){return new RegExp("(.*?)(^|&)"+e+"=([^&]*)&?(.*)")}(e).exec(r)){var i=e[2],n=e[4];r=e[1],n&&(r=r+i+n)}return r}(e,r)).charAt(r.length-1);return r&&"&"!==i&&(r+="&"),r+f}n=!!n;var t=/([^?#]+)(\?[^#]*)?(#.*)?/.exec(i);if(!t)return"";var a=t[1],s=t[2]||"",c=t[3]||"",f=e+"="+r;return n?c="#"+o(c.substring(1)):s="?"+o(s.substring(1)),""+a+s+c}function o(){for(var e,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,i=[window.navigator.userAgent,(new Date).getTimezoneOffset(),window.navigator.userLanguage||window.navigator.language,Math.floor((new Date).getTime()/60/1e3)-0,r?r.join("*"):""].join("*"),n=[],o=0;o<256;o++){e=o;for(var t=0;t<8;t++)e=1&e?3988292384^e>>>1:e>>>1;n[o]=e}for(var a=-1,s=0;s<i.length;s++)a=a>>>8^n[255&(a^i.charCodeAt(s))];return((-1^a)>>>0).toString(36)}function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=e.cookiesNamesList,n=e.gaCookiesPrefix,o=e.conversionLinkerCookiesPrefix,t=new RegExp("^"+n+"_ga"),a=/G[A-Z]1\.[0-9]\.(.+)/,s=[],c=void 0;return Array.isArray(i)?i.forEach((function(e){var i=function(e){for(var r=("; "+document.cookie).split("; "),i=r.length-1;i>=0;i--){var n=r[i].split("=");if(e instanceof RegExp?e.test(n[0]):e===n[0])return[n[0],n[1]]}return[]}(e);e=i[0];var n=i[1];if(n){if(t.test(e))n=n.match(a)[1];else{if("FPLC"===e)return void(c=n);e!==o+"_au"&&"FPAU"!==e||(n=n.split(".").slice(2).join("."))}s.push(r(e,n))}})):Object.keys(i).forEach((function(e){var n=i[e];"FPLC"!==e?s.push(r(e,n)):c=n})),c&&s.push(r("_fplc",c)),s}({cookiesNamesList:e.cookiesNamesList,gaCookiesPrefix:e.gaCookiesPrefix,conversionLinkerCookiesPrefix:e.conversionLinkerCookiesPrefix});return["1",o(i),i.join("*")].join("*")}var a=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"get",a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("undefined"==typeof window||void 0===window.document)throw"This should be only run on a browser";var s={gaCookiesPrefix:a.gaCookiesPrefix||"",conversionLinkerCookiesPrefix:a.conversionLinkerCookiesPrefix||"_gcl",linkerQueryParameterName:a.linkerQueryParameterName||"_gl",checkFingerPrint:!!a.checkFingerPrint||!1,useFragment:!!a.useFragment||!1};switch(a.cookiesNamesList?s.cookiesNamesList=a.cookiesNamesList:(s.cookiesNamesList=[s.gaCookiesPrefix+"_ga",new RegExp("^"+s.gaCookiesPrefix+"_ga_[A-Z,0-9]"),"FPLC","FPAU"],["_aw","_dc","_gb","_gf","_ha","_au"].forEach((function(e){s.cookiesNamesList.push(s.conversionLinkerCookiesPrefix+e)}))),r){case"get":return t({cookiesNamesList:s.cookiesNamesList,gaCookiesPrefix:s.gaCookiesPrefix,conversionLinkerCookiesPrefix:s.conversionLinkerCookiesPrefix});case"read":return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(){var e,r,n,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=t.linkerQueryParameterName,s=t.checkFingerPrint,c=(e=a,r=window.location.href,null===(n=new RegExp("[?&]"+e+"=([^&#]*)","i").exec(r))?null:decodeURIComponent(n[1]));if(c){for(var f=c.split("*").slice(2),u={},g=[],k=0;k<f.length;k+=2){var v=f[k],m=f[k+1];g.push(v+"*"+m),u[v]=i(m)}if(s){var l=o(g);if(c.split("*")[1]!==l)return}return u}}({linkerQueryParameterName:e.linkerQueryParameterName,checkFingerPrint:e.checkFingerPrint})}({linkerQueryParameterName:s.linkerQueryParameterName,checkFingerPrint:s.checkFingerPrint});case"decorate":return function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=r.linkerQueryParameterName,o=r.cookiesNamesList,a=r.gaCookiesPrefix,s=r.conversionLinkerCookiesPrefix,c=r.entity,f=r.useFragment,u=t({cookiesNamesList:o,gaCookiesPrefix:a,conversionLinkerCookiesPrefix:s});if(c.tagName){if("A"===c.tagName)return function(r,i,o,t){if(o&&o.href){var a=n(r,i,o.href,t);if(e.test(a))return o.href=a,o}}(i,u,c,f);if("FORM"===c.tagName)return function(r,i,o){if(o&&o.action){var t=(o.method||"").toLowerCase();if("get"===t){for(var a=o.childNodes||[],s=!1,c=0;c<a.length;c++){var f=a[c];if(f.name===r){f.setAttribute("value",i),s=!0;break}}if(!s){var u=document.createElement("input");u.setAttribute("type","hidden"),u.setAttribute("name",r),u.setAttribute("value",i),o.appendChild(u)}return o}if("post"===t){var g=n(r,i,o.action);if(e.test(g))return o.action=g,o}}}(i,u,c)}if("string"==typeof c)return n(i,u,c,f)}({linkerQueryParameterName:s.linkerQueryParameterName,cookiesNamesList:s.cookiesNamesList,gaCookiesPrefix:s.gaCookiesPrefix,conversionLinkerCookiesPrefix:s.conversionLinkerCookiesPrefix,entity:a.entity,useFragment:s.useFragment})}};return a.prototype={},a.answer=42,a}();
</script>
```


## `get` method

The `get` method returns the linker value.
```js
const linkerParam = googleTagLinker("get", settings);
```

| Argument name | Description | Type | Default |
|---|---|---|---|
| settings.gaCookiesPrefix | Prefix to use when looking for `_ga` cookies. | string\|undefined  | `''` (empty string - i.e. no prefix) |
| settings.conversionLinkerCookiesPrefix | Prefix to use when looking for Conversion Linker (Google Ads, Campaign Manager) cookies. | string\|undefined | `_gcl` |
| settings.cookiesNamesList | List of cookies names to include in the linker parameter or an object containing the names and values of the cookies | (string\|RegExp)[]\|object\|undefined | `["_ga", /^_ga_[A-Z,0-9]/, "FPLC", "_gcl_aw", "_gcl_dc", "_gcl_gb", "_gcl_gf", "_gcl_ha", "_gcl_au", "FPAU"]` |

### Example

Returns the linker using the default arguments.
```js
const linkerParam = googleTagLinker("get");
```

Returns the linker using `my_prefix` as GA4 cookies prefix and `another_prefix` as Conversion Linker cookies prefix.
```js
const linkerParam = googleTagLinker("get", {
    gaCookiesPrefix: 'my_prefix',
    conversionLinkerCookiesPrefix: 'another_prefix'
});
```

Returns the linker just for the `_my_custom_client_id_cookie`, `my_custom_stream_session_cookie` and `/^_my_custom_[0-9]/` cookies.
```js
const linkerParam = googleTagLinker("get", {
    cookiesNamesList: [
        '_my_custom_client_id_cookie',
        'my_custom_stream_session_cookie',
        /^_my_custom_[0-9]/
    ]
});
```

Returns the linker just for the `client_id`, `session_id`, and `user_id` cookies and their values.
```js
const linkerParam = googleTagLinker("get", {
    cookiesNamesList: {
        client_id: '156eb98c-9fe9-4d5d-ae89-db4b3c29849d',
        session_id: '615c74df-5cb9-4dcd-bbb4-6ee4bc5d17a1',
        user_id: 'ABCDE123#@!'
    }
});
```

## `read` method

The `read` method reads the linker parameter from the URL and returns an object with its values parsed and decoded.
```js
const linkerParamParsedAndDecoded = googleTagLinker("read", settings);
```

| Argument name | Description | Type | Default |
|---|---|---|---|
| settings.linkerQueryParameterName | The query parameter name to use as the linker parameter. | string \| undefined | `_gl` |
| settings.checkFingerPrint | Enable or disable checking the fingerprint of the linker parameter. | boolean \| undefined | `false` |


### Example

Returns the linker from the URL using the default arguments and returns an object with its values parsed and decoded.
```js
const linkerParamParsedAndDecoded = googleTagLinker("read");
```

Reads the linker from URL `my_custom_linker_parameter` query parameter and returns an object with its values parsed and decoded.
```js
const linkerParamParsedAndDecoded = googleTagLinker("read", {
    linkerQueryParameterName: 'my_custom_linker_parameter'
});
```

Reads the linker from URL `my_custom_linker_parameter` query parameter and returns an object with its values parsed and decoded, only if the fingerprint is valid.
```js
const linkerParamParsedAndDecoded = googleTagLinker("read", {
    linkerQueryParameterName: 'my_custom_linker_parameter',
    checkFingerPrint: true
});
```

## `decorate` method

The `decorate` method decorates an entity with the linker value and returns the entity. Entities: URL string, `<form>` HTML element, or `<a>` HTML element.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", settings);
```

| Argument name | Description | Type | Default |
|---|---|---|---|
| settings.linkerQueryParameterName | The query parameter name to use as the linker parameter. | string \| undefined  | `_gl` |
| settings.gaCookiesPrefix | Prefix to use when looking for `_ga` cookies. | string \| undefined  | `''` (empty string - i.e. no prefix) |
| settings.conversionLinkerCookiesPrefix | Prefix to use when looking for Conversion Linker (Google Ads, Campaign Manager) cookies. | string \| undefined | `_gcl` |
| settings.cookiesNamesList | List of cookies names to include in the linker parameter or an object containing the names and values of the cookies | (string \| RegExp)[] \| object \| undefined | `[
"_ga", /^_ga_[A-Z,0-9]/, 
"FPLC", "_gcl_aw", "_gcl_dc", "_gcl_gb", _"gcl_gf", "_gcl_ha", "_gcl_au", "FPAU"]` |
| settings.entity | The entity (URL string, `<form>` HTML element or `<a>` HTML element) to be decorated. | HTMLAnchorElement \| HTMLFormElement \| string | `false` |
| settings.useFragment | A flag indicating whether to use the fragment part of the URL or not. | boolean \| undefined | `false` |

### Example

Returns the URL string decorated with linker parameter using default arguments.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", { entity: 'https://example.com' });
```

Returns the URL string decorated with linker parameter using `my_prefix` as GA4 cookies prefix and `another_prefix` as Conversion Linker cookies prefix.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", {
    entity: 'https://example.com',
    gaCookiesPrefix: 'my_prefix',
    conversionLinkerCookiesPrefix: 'another_prefix'
});
```

Returns the URL string decorated with the linker parameter in the fragment part of the URL and uses the `_mylinker` "query parameter".
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", {
    entity: 'https://example.com',
    useFragment: true,
    linkerQueryParameterName: '_mylinker'
});
```

Returns the `<form>` HTML element decorated with linker parameter using default arguments.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", { entity: someFormElement });
```

Returns the `<a>` HTML element decorated with linker just for the `_my_custom_client_id_cookie`, `my_custom_stream_session_cookie` and `/^_my_custom_[0-9]/` cookies.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", {
    entity: someAnchorElement,
    cookiesNamesList: [
        '_my_custom_client_id_cookie',
        'my_custom_stream_session_cookie',
        /^_my_custom_[0-9]/
    ]
});
```

Returns the `<a>` HTML element decorated with linker just for the `client_id`, `session_id`, and `user_id` cookies and their values.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", {
    entity: someAnchorElement,
    cookiesNamesList: {
        client_id: '156eb98c-9fe9-4d5d-ae89-db4b3c29849d',
        session_id: '615c74df-5cb9-4dcd-bbb4-6ee4bc5d17a1',
        user_id: 'ABCDE123#@!'
    }
});
```

# Authors

[David Vallejo](https://www.thyngster.com)

[Giovani Ortolani Barbosa](https://www.linkedin.com/in/giovani-ortolani-barbosa/)
