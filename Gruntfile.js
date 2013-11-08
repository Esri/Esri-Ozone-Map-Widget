module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc : {

            api: {
                src: ['cmwapi/**/*.js'],
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
        },

        jshint: {
            src: ['Gruntfile.js',
                  'cmwapi/**/*.js',
                  'cmwapi-adapter/**/*.js'],
            options: {
                jshintrc: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Workaround for allowing tasks that can fail but should not abort the build chains.
    // Reference: http://stackoverflow.com/questions/16612495/continue-certain-tasks-in-grunt-even-if-one-fails
    grunt.registerTask('usetheforce_on',
        'force the force option on if needed', 
        function() {
            if ( !grunt.option( 'force' ) ) {
                grunt.config.set('usetheforce_set', true);
                grunt.option( 'force', true );
            }
        }
    );
    grunt.registerTask('usetheforce_restore', 
        'turn force option off if we have previously set it', 
        function() {
            if ( grunt.config.get('usetheforce_set') ) {
                grunt.option( 'force', false );
            }
        }
    );

    // Helpful aliases
    grunt.registerTask('test', ['karma']);

    // Default task(s)
    grunt.registerTask('default', ['usetheforce_on', 'jshint', 'usetheforce_restore', 'karma', 'jsdoc']);
};
