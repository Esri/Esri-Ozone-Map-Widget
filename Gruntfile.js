module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc : {

            api: {
                src: ['cmwapi/Channels.js',
                      'cmwapi/Validator.js',],
                dest: 'target/jsdoc/cmwapi'
            },
            apiAdapter: {
                src: ['cmwapi-adapter/**/*.js'],
                dest: 'target/jsdoc/cmwapi-adapter'
            },
            widget : {
                src: ['owf-map-widget/js/*.js',
                      'owf-map-widget/js/models/**/*.js'],
                dest: 'target/jsdoc/widget'
            }
        },

        karma: {
            unit: {
                configFile: 'test/test-phantom.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');

    // Helpful aliases
    grunt.registerTask('test', ['karma']);

    // Default task(s)
    grunt.registerTask('default', ['karma', 'jsdoc']);
};
