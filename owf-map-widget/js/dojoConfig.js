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
    /**
      * Determine if webapp is running in <b>offline</b> mode.
      * @global
      */
    window.isOffline = function() {
        // Test if "offline=true" was passed in URL
        return /.*offline\s*=\s*true.*/i.test(
                   decodeURIComponent(window.location.search));
    }
}

if (!window.isDebug) {
    /**
      * Determine if webapp is running in <b>debug</b> mode.
      * @global
      */
    window.isDebug = function() {
        // Test if "debug=true" was passed in URL
        return /.*debug\s*=\s*true.*/i.test(
                   decodeURIComponent(window.location.search));
    }
}

if (!window.contextPath) {
    /**
     * Specifies absolute path to root of this webapp. Only works if the
     * JavaScript file defining this member is loaded by index.html (or
     * another file in the webapp root).
     * @global
     */
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
    /**
     * Specifies path to OWF widget JavaScript API. Prefers files from OWF
     * server it available.
     * @global
     */
    window.owfJsPath = (function() {
        var path = window.contextPath + "vendor/js/";

        if (document.referrer &&
            /\/owf\/$/i.test(decodeURIComponent(document.referrer))) {
                path = decodeURIComponent(document.referrer) + "js-min/";
        }

        return path;
    })();
}

if (!window.esriJsPath) {
    /**
     * Specifies path to ESRI JavaScript API. Returns the location hosted on
     * the Internet by default. When isOffline() is true returns a location
     * hosted within this webapp.
     * @global
     */
    window.esriJsPath = (function() {
        var path = "http://js.arcgis.com/3.7/";

        if (window.isOffline()) {
            // Use local copy of API files
            path = window.contextPath + "vendor/js/esri-3.7/";
        } else if (window.location.protocol != "file:") {
            // Match same protocol as page to avoid mixed content issues
            path = path.replace("http://", window.location.protocol + "//");
        }

        return path;
    })();
}

if (!window.esriGeometryService) {

  window.esriGeometryService = "http://servicesbeta.esri.com/ArcGIS/rest/services/Geometry/GeometryServer";

}

/**
 * Dojo AMD loader configuration defined to allow ESRI libraries to be
 * loaded either from the Internet or within this webapp depending on the
 * value of isOffline().
 * @global
 */
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
    { location: window.contextPath + "digits", name: "digits" },
    { location: window.contextPath + "../cmwapi", name: "cmwapi" },
    { location: window.contextPath + "../cmwapi-adapter", name: "cmwapi-adapter" },
    { location: window.contextPath + "js", name:"OWFWidgetExtensions"},
    { location: window.contextPath + "vendor/js", name: "notify" }
];
