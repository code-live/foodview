'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function() {
    return gulp.src([
            path.join(conf.paths.src, '/app/**/*.html')
        ])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest(conf.paths.dist + '/app/'));
});


gulp.task('html', ['inject', 'partials'], function() {

    var htmlFilter = $.filter('*.html', {
        restore: true
    });
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });
    var partialFilter = $.filter('**/*.html', {
        restore: true
    });
    var assets;

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({
            preserveComments: $.uglifySaveLicense
        })).on('error', conf.errorHandler('Uglify'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
        .pipe($.minifyCss({
            processImport: false
        }))
        .pipe(cssFilter.restore)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({
            title: path.join(conf.paths.dist, '/'),
            showFiles: true
        }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function() {
    return gulp.src([
            path.join(conf.paths.src, '/resources/fonts/**/*.{eot,svg,otf,ttf,woff,woff2}')
        ])
        .pipe(gulp.dest(path.join(conf.paths.dist, '/resources/fonts/')));
});

gulp.task('images', function() {
    return gulp.src(conf.paths.src + '/**/*.{png,jpg,gif}')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size());
});

gulp.task('other', function() {
    var fileFilter = $.filter(function(file) {
        return file.stat.isFile();
    });

    return gulp.src([
            path.join(conf.paths.src, '/**/*'),
            path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss,eot,jpg,png,gif,otf,ttf,woff,woff2}'),
            path.join('!' + conf.paths.src, '/resources/stubs/*.json')
        ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function() {
    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build', ['html', 'fonts', 'other', 'images']);
