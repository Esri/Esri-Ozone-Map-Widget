module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc : {
            cmwapi: {
                src: ['README.md', 'cmwapi/**/*.js', 'cmwapi-adapter/**/*.js'],
                options: {
                    destination: 'target/jsdoc/cmwapi',
                    template: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure: "jsdoc.conf.json",
                    private: true
                }
            },
            widget : {
                src: ['owf-map-widget/js/*.js',
                      'owf-map-widget/js/models/**/*.js'],
                options: {
                    destination: 'target/jsdoc/widget',
                    private: true,
                    template: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure: "jsdoc.conf.json"
                }
            }
        },

        karma: {
            unit: {
                configFile: 'test/test-phantom.conf.js'
            },
            chrome: {
                configFile: 'test/test-chrome.conf.js'
            }
        },

        jshint: {
            src: ['Gruntfile.js',
                  'cmwapi/**/*.js',
                  'cmwapi-adapter/**/*.js'],
            options: {
                jshintrc: true
            }
        },

        uglify: {
            options: {
              banner: '<%= pkg.license %>'
            },
            cmwapi: {
                files: [{ 
                    src: 'cmwapi/**/*.js',  // source files mask
                    dest: 'deployment',    // destination folder
                    expand: true,    // allow dynamic building
                    flatten: false   // remove all unnecessary nesting
                    //ext: '.min.js'   // replace .js to .min.js
                }]
            },
            cmwapi_adapter: {
                files: [{ 
                    src: 'cmwapi-adapter/**/*.js',  // source files mask
                    dest: 'deployment',    // destination folder
                    expand: true,    // allow dynamic building
                    flatten: false   // remove all unnecessary nesting
                    //ext: '.min.js'   // replace .js to .min.js
                }]
            }
        },

        copy: {
            main: {
                files: [
                  // includes files within path and its sub-directories
                  {expand: true, src: ['cmwapi/**'], dest: 'owf-map-widget/js/lib'},

                  {expand: true, src: ['cmwapi-adapter/**'], dest: 'owf-map-widget/js/lib'}

                  ]
             },
             deployment: {
                files: [
                    // includes files within path and its sub-directories
                  {expand: true, src: ['basic-map-widget/**'], dest: 'deployment'},
                  {expand: true, src: ['contacts/**'], dest: 'deployment'},
                  {expand: true, src: ['owf-map-widget/**'], dest: 'deployment'}
                ]
             }
        },

        clean : {
            deployment : {
                src : [ "deployment/**" ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

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
    grunt.registerTask('default', ['usetheforce_on', 'jshint', 'usetheforce_restore', 'karma', 'jsdoc'/**, 'copy'**/]  );

    // Deployment task
    grunt.registerTask('deploy', ['clean:deployment', 'usetheforce_on', 'jshint', 'usetheforce_restore', 
        'karma:unit', 'jsdoc', 'uglify', 'copy:deployment']);
};
