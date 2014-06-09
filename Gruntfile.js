module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            options: {
                // use grunt-react to transform JSX content on the fly when building
                transform: [require('grunt-react').browserify],
                // create source maps
                debug    : true
            },
            app    : {
                // main entry point for application
                src : 'src/client/main.js',
                // destination output file for build
                dest: 'build/assets/js/main.js'
            }
        },
        watch     : {
            files: ['./src/**/*.js'],
            tasks: ['browserify:app']
        },
        copy      : {
            fonts   : {
                expand: true,
                cwd   : 'src/',
                src   : ['./fonts/*'],
                dest  : 'build/assets'
            },
            icons   : {
                cwd   : 'src/',
                expand: true,
                src   : ['./icons/*'],
                dest  : 'build/assets/'

            },
            locales : {
                cwd: 'src/locales/',
                expand: true,
                src   : ['**'],
                dest  : 'build/_locales/'

            },
            manifest: {
                src : ['src/manifest.json'],
                dest: 'build/manifest.json'

            },
            main: {
                src: ['src/client/index.html'],
                dest: 'build/index.html'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
//grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['browserify:app', 'copy:fonts', 'copy:icons', 'copy:locales', 'copy:manifest', 'copy:main']);
};