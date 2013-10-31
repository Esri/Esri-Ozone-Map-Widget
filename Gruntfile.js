module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc : {
            dist : {
                src: ['esri-owf-map-widget/js/*.js',
                      'esri-owf-map-widget/js/models/**/*.js',
                      'esri-cmwapi-adapter/**/*.js'],
                dest: 'target/jsdoc'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s)
    grunt.registerTask('default', ['jsdoc']);
};
