module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc : {
            api: {
                src: ['cmwapi/**/*.js'],
                options: {
                    destination: 'target/jsdoc/cmwapi',
                    private: true
                }
            },
            apiAdapter: {
                src: ['cmwapi-adapter/**/*.js'],
                options: {
                    destination: 'target/jsdoc/cmwapi-adapter',
                    private: true
                }
            },
            widget : {
                src: ['owf-map-widget/js/*.js',
                      'owf-map-widget/js/models/**/*.js'],
                options: {
                    destination: 'target/jsdoc/widget',
                    private: true
                }
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
