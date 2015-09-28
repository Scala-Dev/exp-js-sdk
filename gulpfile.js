var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require('gulp-babel');

// player tasks

gulp.task('build-node', function () {
  return gulp.src('./src/**/*')
    .pipe(babel())
    .pipe(gulp.dest('./build/node'));
});

gulp.task('build-webbrowser', ['build-node'], function () {
  return browserify('./scala.js', {
    basedir: './build/node',
    paths: ['./']
  })
    .bundle()
    .pipe(source('scala-sdk.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build/webbrowser'));
});
gulp.task('default', ['build-webbrowser']);
