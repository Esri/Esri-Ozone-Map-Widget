module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc : {
            dist : {
                src: ['cmwapi/Channels.js',
                      'cmwapi/Validator.js',
                      'esri-owf-map-widget/js/*.js',
                      'esri-owf-map-widget/js/models/**/*.js',
                      'esri-cmwapi-adapter/**/*.js'],
                dest: 'target/jsdoc'
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

    // Default task(s)
    grunt.registerTask('default', ['karma', 'jsdoc']);
};
