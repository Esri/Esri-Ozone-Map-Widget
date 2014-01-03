// Entry point for using Require.js to run Karma tests
var tests = [];

for (var file in window.__karma__.files) {
    if (/spec\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
        'cmwapi': 'cmwapi',
        'cmwapi-adapter': 'cmwapi-adapter',
        'owf-map-widget': 'owf-map-widget',
        'owf-widget-extended': 'owf-widget-extended',
        'esri': 'test/mock/esri'


// {
//              name: 'dojo',
//              location: 'http://js.arcgis.com/3.7/js/dojo/dojo'
//          }, {
//              name: 'dojox',
//              location: 'http://js.arcgis.com/3.7/js/dojo/dojox'
//          }, {
//              name: 'dijit',
//              location: 'http://js.arcgis.com/3.7/js/dojo/dijit'
//          },

    },

    // Ask Require.js to load these files (all our tests)
    deps: tests,

    // Start test run, once Require.js is ready
    callback: window.__karma__.start
});