var basePath = './';
var jshint = require('gulp-jshint');
var gulp = require('gulp');
var fs =require('fs');

gulp.task('jshint', function () {
    return gulp.src([ basePath + 'index.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watches', function(){
    gulp.watch([ 
        basePath + '*.js', 
        basePath + '__tests__/*.js'
    ], ['jshint', 'tests']);
});

gulp.task('default', [ 'tests', 'jshint', 'watches' ]);
gulp.task('compile', [ 'tests' ]);