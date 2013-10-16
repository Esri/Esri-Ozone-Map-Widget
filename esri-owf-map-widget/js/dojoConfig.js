// Setup dojo module loader for use with both ESRI JavaScript API and our
// local webapp files. This file MUST be included BEFORE dojo is loaded.
// NOTE: This webapp supports using the ESRI JavaScript in an "offline" mode
// wherein a local version can be bundled by the developer instead of
// referencing the files from the ESRI site. To enable "offline" mode:
// 1. Download the arcgis_js_v37_api.zip package from
// http://www.esri.com/apps/products/download.
// 2. Unzip and copy the contents of arcgis_js_api/library/3.7/3.7 to
// [webAppContext]/js/lib/esri-3.7.
// 3. Run the map webapp with "offline=true" set as a URL parameter.

// Define some global helper functions that can be used to set paths to the
// ESRI and OWF JavaScript files.
if (!window.isOffline) {
    window.isOffline = function() {
        // Test if "offline=true" was passed in URL
        return /.*offline\s*=\s*true.*/i.test(
                   decodeURIComponent(window.location.search));
    }
}

if (!window.isDebug) {
    window.isDebug = function() {
        // Test if "debug=true" was passed in URL
        return /.*debug\s*=\s*true.*/i.test(
                   decodeURIComponent(window.location.search));
    }
}

if (!window.contextPath) {
    // Define absolute path to root of webapp. This only works if this
    // JavaScript file is loaded by index.html (or another file in the
    // root).
    window.contextPath = (function() {
        var loc = window.location;
        var path = loc.protocol + "//";

        if (loc.hostname) {
            path += loc.hostname;

            if (loc.port) {
                path += ":" + loc.port;
            }
        }

        path += loc.pathname;

        // Remove filename if present
        path = path.replace(/\/[^\/]+$/, "/");

        return path;
    })();
}

if (!window.owfJsPath) {
    window.owfJsPath = (function() {
        var path = window.contextPath + "js/lib/";

        // Define path to OWF widget JavaScript API. Prefer files from OWF
        // server it available.
        if (document.referrer &&
            /\/owf\/$/i.test(decodeURIComponent(document.referrer))) {
                path = decodeURIComponent(document.referrer) + "js-min/";
        }

        return path;
    })();
}

if (!window.esriJsPath) {
    window.esriJsPath = (function() {
        var path = "http://js.arcgis.com/3.7/";

        if (window.isOffline()) {
            // Use local copy of API files
            path = window.contextPath + "js/lib/esri-3.7/";
        } else if (window.location.protocol != "file:") {
            // Match same protocol as page to avoid mixed content issues
            path = path.replace("http://", window.location.protocol + "//");
        }

        return path;
    })();
}

var dojoConfig = dojoConfig || {};

// ESRI JavaScript API 3.7 does not load asynchronously
dojoConfig.async = false;

dojoConfig.hasCache = {
    "config-selectorEngine": "acme",
    "config-tlmSiblingOfDojo": 1,
    "dojo-built": 1,
    "dojo-loader": 1,
    "dojo-undef-api": 0,
    dom: 1,
    "extend-esri": 1,
    "host-browser": 1
};

dojoConfig.packages = [
    // Required by ESRI and its bundled dojo
    { location: window.esriJsPath + "js/dojo/dojox", name: "dojox" },
    { location: window.esriJsPath + "js/dgrid", main: "OnDemandGrid", name: "dgrid" },
    { location: window.esriJsPath + "js/dojo/dijit", name: "dijit" },
    { location: window.esriJsPath + "js/xstyle", main: "css", name: "xstyle" },
    { location: window.esriJsPath + "js/esri", name: "esri" },
    { location: window.esriJsPath + "js/dojo/dojo", name: "dojo" },
    { location: window.esriJsPath + "js/put-selector", main: "put", name: "put-selector" },

    // Additional packages for this webapp
    { location: window.contextPath + "js/models", name: "models" },
    { location: window.contextPath + "js/lib", name: "lib" }
];
