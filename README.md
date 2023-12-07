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


# Google Tag Linker Brigde (and any other analytics/marketing tools)

Hola! Olá! This is a **JavaScript** library that provided the needed functionality for creating a `linkerParam` for Google Analytics 4 (**_`Google Tag`_**, **_`GTAG`_**). I
It also works for any other analytics/marketing tools.

At the time of publishing this library Google doesn't offer any "documented" way of generating this value, making really hard to work with custom implementations, for example when needing to deal with iFrames or forms/links generated dynamically.

The library is provided in the `AMD`, `UMD`, `IIFE` and `ESM` formats, all of them available in the `dist` folder.

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

The usage for this fingerprinting is not identifying the user, but making the current link only to work on the current user browser and making it valid only for the current minute (since many users may share the same browser specs).

The Linker Parameter will look like this:

    1*dm649n*_ga*MTM2MDM4NDg1MS4xNjYxODIxMjQy*_ga_THYNGSTER*XXXXXXXXXXXXXXX*_gcl_aw*AAAAAAAAAAAA*_gcl_dc*BBBBBBBBBBB*_gcl_gb*CCCCCCCCCCCC*_gcl_gf*DDDDDDDDDDD*_gcl_ha*EEEEEEEEEEEE*_fplc*MTExMTExMTExMTExMTExMTExMTEx

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
| FPLC | First Party Linker Cookie from SGTM cookie |

You can also specify a list of cookie names to be read or an object containing the cookie names (as keys) and cookie values (as values).

# Notes

This is a beta version, while it should work fine for doing a GA4 cross-domain tracking, some features needs to in a future, check next section.

When there are multiple GA4 session cookies, the code reads the last one present in `document.cookie` string, if it wasn't manually passed to the `googleTagLinker` function as argument.

# To-Do

- [x] Add Adwords / Double Click Support
- [x] QA environments with multiple cookies
- [x] Add the chance to manually defined the cookies to be passed
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
Keep in mind that **you will not receive updates**. This is a viable aproach if you use GTM.
If installing via GTM, choose the `googleTagLinker.iife.min.js` version.

```html
<!--
Inside a Custom HTML tag in GTM, add the your preferred minified version

Make sure that it fires before your product analytics or marketing analytics tool that will use the information appended in the query string (cross-domain).
To do that, add this tag as a setup tag of your tool.
-->

<script>
var googleTagLinker=function(){"use strict";var e=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;function r(e,r){return[e,window.btoa(r).replace(/=/g,".")].join("*")}function i(e){return window.atob(e.replace(/\./g,"="))}function t(e,r,i,t){function n(r){var i=(r=function(e,r){if(e=function(e){return new RegExp("(.*?)(^|&)"+e+"=([^&]*)&?(.*)")}(e).exec(r)){var i=e[2],t=e[4];r=e[1],t&&(r=r+i+t)}return r}(e,r)).charAt(r.length-1);return r&&"&"!==i&&(r+="&"),r+c}t=!!t;var o=/([^?#]+)(\?[^#]*)?(#.*)?/.exec(i);if(!o)return"";var a=o[1],s=o[2]||"",u=o[3]||"",c=e+"="+r;return t?u="#"+n(u.substring(1)):s="?"+n(s.substring(1)),""+a+s+u}function n(){for(var e,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,i=[window.navigator.userAgent,(new Date).getTimezoneOffset(),window.navigator.userLanguage||window.navigator.language,Math.floor((new Date).getTime()/60/1e3)-0,r?r.join("*"):""].join("*"),t=[],n=0;n<256;n++){e=n;for(var o=0;o<8;o++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}for(var a=-1,s=0;s<i.length;s++)a=a>>>8^t[255&(a^i.charCodeAt(s))];return((-1^a)>>>0).toString(36)}function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=e.cookiesNamesList,t=e.gaCookiesPrefix,n=new RegExp("^"+t+"_ga"),o=[],a=void 0;return Array.isArray(i)?i.forEach((function(e){var i=function(e){for(var r=("; "+document.cookie).split("; "),i=r.length-1;i>=0;i--){var t=r[i].split("=");if(e instanceof RegExp?e.test(t[0]):e===t[0])return[t[0],t[1]]}return[]}(e);e=i[0];var t=i[1];if(t){if(n.test(e))t=t.match(/G[A-Z]1\.[0-9]\.(.+)/)[1];else if("FPLC"===e)return void(a=t);o.push(r(e,t))}})):Object.keys(i).forEach((function(e){var t=i[e];"FPLC"!==e?o.push(r(e,t)):a=t})),a&&o.push(r("_fplc",a)),o}({cookiesNamesList:e.cookiesNamesList,gaCookiesPrefix:e.gaCookiesPrefix});return["1",n(i),i.join("*")].join("*")}var a=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"get",a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("undefined"==typeof window||void 0===window.document)throw"This should be only run on a browser";var s={gaCookiesPrefix:a.gaCookiesPrefix||"",conversionLinkerCookiesPrefix:a.conversionLinkerCookiesPrefix||"_gcl",linkerQueryParameterName:a.linkerQueryParameterName||"_gl",checkFingerPrint:!!a.checkFingerPrint||!1,useFragment:!!a.useFragment||!1};switch(a.cookiesNamesList?s.cookiesNamesList=a.cookiesNamesList:(s.cookiesNamesList=[s.gaCookiesPrefix+"_ga",new RegExp("^"+s.gaCookiesPrefix+"_ga_[A-Z,0-9]"),"FPLC"],["_aw","_dc","_gb","_gf","_ha"].forEach((function(e){s.cookiesNamesList.push(s.conversionLinkerCookiesPrefix+e)}))),r){case"get":return o({cookiesNamesList:s.cookiesNamesList,gaCookiesPrefix:s.gaCookiesPrefix});case"read":return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(){var e,r,t,o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=o.linkerQueryParameterName,s=o.checkFingerPrint,u=(e=a,r=window.location.href,null===(t=new RegExp("[?&]"+e+"=([^&#]*)","i").exec(r))?null:decodeURIComponent(t[1]));if(u){for(var c=u.split("*").slice(2),f={},g=[],k=0;k<c.length;k+=2){var m=c[k],v=c[k+1];g.push(m+"*"+v),f[m]=i(v)}if(s){var l=n(g);if(u.split("*")[1]!==l)return}return f}}({linkerQueryParameterName:e.linkerQueryParameterName,checkFingerPrint:e.checkFingerPrint})}({linkerQueryParameterName:s.linkerQueryParameterName,checkFingerPrint:s.checkFingerPrint});case"decorate":return function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=r.linkerQueryParameterName,n=r.cookiesNamesList,a=r.gaCookiesPrefix,s=r.entity,u=r.useFragment,c=o({cookiesNamesList:n,gaCookiesPrefix:a});if(s.tagName){if("A"===s.tagName)return function(r,i,n,o){if(n&&n.href){var a=t(r,i,n.href,o);if(e.test(a))return n.href=a,n}}(i,c,s,u);if("FORM"===s.tagName)return function(r,i,n){if(n&&n.action){var o=(n.method||"").toLowerCase();if("get"===o){for(var a=n.childNodes||[],s=!1,u=0;u<a.length;u++){var c=a[u];if(c.name===r){c.setAttribute("value",i),s=!0;break}}if(!s){var f=document.createElement("input");f.setAttribute("type","hidden"),f.setAttribute("name",r),f.setAttribute("value",i),n.appendChild(f)}return n}if("post"===o){var g=t(r,i,n.action);if(e.test(g))return n.action=g,n}}}(i,c,s)}if("string"==typeof s)return t(i,c,s,u)}({linkerQueryParameterName:s.linkerQueryParameterName,cookiesNamesList:s.cookiesNamesList,gaCookiesPrefix:s.gaCookiesPrefix,entity:a.entity,useFragment:s.useFragment})}};return a.prototype={},a.answer=42,a}();
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
| settings.cookiesNamesList | List of cookies names to include in the linker parameter or an object containing the cookies names and values | (string\|RegExp)[]\|object\|undefined | `["_ga", /^_ga_[A-Z,0-9]/, "FPLC", "_gcl_aw", "_gcl_dc", "_gcl_gb", _"gcl_gf", "_gcl_ha"]` |

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
    cookiesNamesList: ['_my_custom_client_id_cookie', 'my_custom_stream_session_cookie', /^_my_custom_[0-9]/]
});
```

Returns the linker just for the `client_id`, `session_id` and `user_id` cookies and their values.
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

The `read` method reads the linker parameter from URL and returns an object with it's values parsed and decoded.
```js
const linkerParamParsedAndDecoded = googleTagLinker("read", settings);
```

| Argument name | Description | Type | Default |
|---|---|---|---|
| settings.linkerQueryParameterName | The query parameter name to use as the linker parameter. | string \| undefined | `_gl` |
| settings.checkFingerPrint | Enable or disable checking the fingerprint of the linker parameter. | boolean \| undefined | `false` |


### Example

Returns the linker from URL using the default arguments and returns an object with it's values parsed and decoded.
```js
const linkerParamParsedAndDecoded = googleTagLinker("read");
```

Reads the linker from URL `my_custom_linker_parameter` query parameter and returns an object with it's values parsed and decoded.
```js
const linkerParamParsedAndDecoded = googleTagLinker("read", { linkerQueryParameterName: 'my_custom_linker_parameter' });
```

Reads the linker from URL `my_custom_linker_parameter` query parameter and returns an object with it's values parsed and decoded, only if the fingerprint is valid.
```js
const linkerParamParsedAndDecoded = googleTagLinker("read", {
    linkerQueryParameterName: 'my_custom_linker_parameter',
    checkFingerPrint: true
});
```

## `decorate` method

The `decorate` method decorates an entity with the linker value and returns the entity. Entities: URL string, `<form>` HTML element or `<a>` HTML element.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", settings);
```

| Argument name | Description | Type | Default |
|---|---|---|---|
| settings.linkerQueryParameterName | The query parameter name to use as the linker parameter. | string \| undefined  | `_gl` |
| settings.gaCookiesPrefix | Prefix to use when looking for `_ga` cookies. | string \| undefined  | `''` (empty string - i.e. no prefix) |
| settings.conversionLinkerCookiesPrefix | Prefix to use when looking for Conversion Linker (Google Ads, Campaign Manager) cookies. | string \| undefined | `_gcl` |
| settings.cookiesNamesList | List of cookies names to include in the linker parameter or an object containing the cookies names and values | (string \| RegExp)[] \| object \| undefined | `["_ga", /^_ga_[A-Z,0-9]/, "FPLC", "_gcl_aw", "_gcl_dc", "_gcl_gb", _"gcl_gf", "_gcl_ha"]` |
| settings.entity | The entity (URL string, `<form>` HTML element or `<a>` HTML element) to be decorated. | HTMLAnchorElement \| HTMLFormElement \| string | `false` |
| settings.useFragment | A flag indicating whether to use the fragment part of the URL or not. | boolean \| undefined | `false` |

### Example

Returns the URL string decorated with linker parameter using default arguments.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", { entity: 'https://example.com' });
```

Returns the URL string decorated with linker parameter using using `my_prefix` as GA4 cookies prefix and `another_prefix` as Conversion Linker cookies prefix.
```js
const entityDecoratedWithLinkerValue = googleTagLinker("decorate", {
    entity: 'https://example.com',
    gaCookiesPrefix: 'my_prefix',
    conversionLinkerCookiesPrefix: 'another_prefix'
});
```

Returns the URL string decorated with linker parameter in the fragment part of the URL and using the `_mylinker` "query parameter".
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
    cookiesNamesList: ['_my_custom_client_id_cookie', 'my_custom_stream_session_cookie', /^_my_custom_[0-9]/]
});
```

Returns the `<a>` HTML element decorated with linker just for the `client_id`, `session_id` and `user_id` cookies and their values.
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
