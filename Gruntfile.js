/**
 * Created by fy on 15-9-13.
 */
'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_client: {
                files: [{
                    expand: true,
                    cwd: 'public/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: '../dest/zsysb/public'
                }]
            },
            my_server: {
                files: {
                    '../dest/zsysb/config/db.js': ['config/db.js'],
                    '../dest/zsysb/lib/date/index.js': ['lib/date/index.js'],
                    '../dest/zsysb/lib/pager/select-pager.js': ['lib/pager/select-pager.js'],
                    '../dest/zsysb/lib/pdf/index.js': ['lib/pdf/index.js'],
                    '../dest/zsysb/lib/pinyin/index.js': ['lib/pinyin/index.js'],
                    '../dest/zsysb/lib/utils.js': ['lib/utils.js'],
                    '../dest/zsysb/routes/book/category.js': ['routes/book/category.js'],
                    '../dest/zsysb/routes/book/pdf.js': ['routes/book/pdf.js'],
                    '../dest/zsysb/routes/user/index.js': ['routes/user/index.js'],
                    '../dest/zsysb/routes/about.js': ['routes/about.js'],
                    '../dest/zsysb/routes/index.js': ['routes/index.js'],
                    '../dest/zsysb/service/api/service.js': ['service/api/service.js'],
                    '../dest/zsysb/service/book/category.js': ['service/book/category.js'],
                    '../dest/zsysb/service/book/pdf.js': ['service/book/pdf.js'],
                    '../dest/zsysb/service/user/index.js': ['service/user/index.js'],
                    '../dest/zsysb/app.js': ['app.js']
                }
            }
        },
        cssmin: {
            files: {
                expand: true,
                cwd: 'public',
                src: ['**/*.css', '!**/*.min.css'],
                dest: '../dest/zsysb/public'
                //ext: '.css'
            }
        },
        copy: {
            my_pdf_img:{
                flatten:true,
                src:'public/files/**/*.txt',
                dest:'../dest/zsysb/'
            },
            my_sql:{
                flatten:true,
                src:'config/init-db.sql',
                dest:'../dest/zsysb/'
            },
            my_img: {
                flatten: true,
                src: 'public/assets/images/*',
                dest: '../dest/zsysb/'
            },
            my_package: {
                flatten: true,
                src: 'package.json',
                dest: '../dest/zsysb/package.json'
            },
            my_rpc: {
                flatten: true,
                src: 'lib/rpc/**/*',
                dest: '../dest/zsysb/'
            },
            my_views: {
                flatten: true,
                src: 'views/**/*',
                dest: '../dest/zsysb/'
            },
            my_css: {
                flatten: true,
                src: 'public/**/*.min.css',
                dest: '../dest/zsysb/'
            },
            my_js: {
                flatten: true,
                src: 'public/**/*.min.js',
                dest: '../dest/zsysb/'
            },
            my_node_modules: {
                flatten: true,
                src: 'node_modules/**/*',
                dest: '../dest/zsysb/'
            },
            my_font: {
                flatten: true,
                src: 'public/**/font/*',
                dest: '../dest/zsysb/'
            },
            my_main: {
                flatten: true,
                src: 'zsysb.js',
                dest: '../dest/zsysb/zsysb.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['cssmin', 'uglify', 'copy']);

};