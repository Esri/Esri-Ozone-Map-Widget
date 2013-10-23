// Karma configuration
// Generated on Thu Oct 17 2013 08:58:54 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '..',

    // Disable the html2js preprocessor to prevent Karma from adding a js extension to any
    // HTML files that need to be included on the Karma server.
    preprocessors: {'**/*.html': [] },

    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        //include source files here; paths are relative to basePath as defined above.
        {pattern: 'api/**/*.js', included: true, served: true},

        //all spec files
        'test/spec/**/*.spec.js',

        // Make any necessary descriptions, relay files available on the Karma server for tests
        // The relay file under the api-test-widget is provided as an example.
        {pattern: 'api-test-widget/js/eventing/*.html', included: false, served: true}
    ],


    // list of files to exclude
    exclude: [
        './**/*.bak'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'dots'],
    

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
