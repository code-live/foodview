'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var jshint = require('gulp-jshint');

function isOnlyChange(event) {
    return event.type === 'changed';
}


// task
gulp.task('jslint', function() {
    gulp.src(path.join(conf.paths.src, '/app/**/*.js')) // path to your files
        // .pipe(jshint())
        // .pipe(jshint.reporter()); // Dump results
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
