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
        'cmwapi': 'cmwapi/cmwapi',
        'cmwapi-adapter': 'cmwapi-adapter/cmwapi-adapter',
        'cmwapi-overlay-manager': 'cmwapi-adapter/cmwapi-overlay-manager',
        'esri': 'test/mock/esri',
    },

    // Ask Require.js to load these files (all our tests)
    deps: tests,

    // Start test run, once Require.js is ready
    callback: window.__karma__.start
});
