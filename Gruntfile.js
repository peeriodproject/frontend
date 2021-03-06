var fs = require('fs');

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
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'build/assets/css/main.css',
                        'build/assets/js/main.js'
                    ]
                },
                options: {
                    watchTask: true
                }
            }
        },
        watch     : {
            client: {
                files: ['./src/client/**/*.js'],
                tasks: ['browserify:app']
            },
            background: {
                files: ['./src/background/*'],
                tasks: [
                    'clean:background',
                    //'copy:background',
                    'uglify:background'
                ]
            }
        },
        copy      : {
            fonts   : {
                expand: true,
                cwd   : 'src/',
                src   : ['./fonts/*'],
                dest  : 'build/assets'
            },
            icons   : {
                nonull: true,
                cwd   : 'src/icons/app',
                expand: true,
                src   : ['**'],
                dest  : 'build/assets/icons'

            },
            images: {
                cwd: 'src/images',
                expand: true,
                src   : ['**'],
                dest  : 'build/assets/images'
            },
            locales : {
                cwd: 'src/locales/',
                expand: true,
                src   : ['**'],
                dest  : 'build/_locales/'

            },
            manifest: {
                nonull: true,
                src : ['src/manifest.json'],
                dest: 'build/manifest.json'

            },
            main: {
                nonull: true,
                src: ['src/client/index.html'],
                dest: 'build/index.html',
                options: {
                    process: function (content, srcpath) {
                        return content.replace('{{ svgIcons }}', fs.readFileSync('./src/icons/svg_output/icons.svg', 'utf8'));
                    }
                }
            },
            ping: {
                nonull: true,
                src : ['src/ping.txt'],
                dest: 'build/ping.txt'
            }
            /*,
            background: {
                notnull: true,
                src: ['src/background/background.html'],
                dest: 'build/background/background.html'
            }*/
        },
        compass: {
            dist: {
                options: {
                    config: './config.rb'
                }
            }
        },
        cssmin: {
            libraries: {
                src: [
                    './bower_components/animate.css/animate.css',
                    './bower_components/select/css/select-theme-default.css'
                ],
                dest: 'build/assets/css/libraries.css',
            }
        },
        uglify: {
            libraries: {
                files: {
                    'build/assets/js/libraries.js': [
                        './bower_components/jquery/dist/jquery.js',
                        './bower_components/jQuery.dotdotdot/src/js/jquery.dotdotdot.js',
                        './bower_components/tether/tether.js',
                        './bower_components/drop/drop.js',
                        './bower_components/tether-tooltip/js/tooltip.js',
                        './bower_components/shepherd.js/js/shepherd.js',
                        './bower_components/headroom.js/dist/headroom.js',
                        './bower_components/html2canvas/build/html2canvas.js',
                        './bower_components/springy/springy.js',
                        './src/client/lib/springyui.js'
                        //'./bower_components/select/js/select.js',
                        //'./bower_components/d3/d3.js'
                    ]
                }
            },
            background: {
                files: {
                    'build/background/background.js': [
                        'src/background/background.js'
                    ]
                }
            }
        },
        clean: {
            assets: ['build/assets'],
            background: ['build/background'],
            icons: [   
                'src/icons/svg_compressed',
                'src/icons/svg_output'
            ]
        },

        svgmin: { //minimize SVG files
            options: {
                plugins: [
                    { removeViewBox: false },
                    { removeUselessStrokeAndFill: false }
                ]
            },
            dist: {
                expand: true,
                cwd: 'src/icons/svg',
                src: ['*.svg'],
                dest: 'src/icons/svg_compressed',
                ext: '.svg'
            }
        },

        svgstore: {
            options: {
                prefix : 'icon-', // This will prefix each ID
                svg: { // will be added as attributes to the resulting SVG
                    viewBox : '0 0 100 100'
                }
            },
            default : {
                files: {
                    'src/icons/svg_output/icons.svg': ['src/icons/svg_compressed/*.svg'],
                },
            },
        },

        jsdoc : {
            dist : {
                src: [
                    'src/**/*.js'
                ],
                options: {
                    destination: 'docs',
                    configure: './jsdoc.json'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-svgstore');

    grunt.registerTask('default', [
        'build',
        'browserSync',
        'watch',

    ]);

    grunt.registerTask('svgicons', ['clean:icons', 'svgmin', 'svgstore:default', 'copy:main']);

    grunt.registerTask('build', [
        'svgicons',
        'clean:assets',
        'clean:background',
        'browserify:app',
        'copy:fonts',
        'copy:icons',
        'copy:images',
        'copy:locales',
        'copy:manifest',
        //'copy:background',
        'compass:dist',
        'uglify:libraries',
        'uglify:background',
        'cssmin:libraries',
        //'jsdoc'
    ]);
};