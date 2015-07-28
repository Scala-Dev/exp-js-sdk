var gulp = require('gulp');
var replace = require('gulp-replace');
var argv = require('yargs').argv;
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require('gulp-babel');
var babelify = require('babelify');

gulp.task('build-node', function () {
  return gulp.src('./src/**/*')
    .pipe(babel())
    .pipe(gulp.dest('./build/node'));
});

gulp.task('build-webbrowser', function () {
  return browserify('./scala.js', {
    basedir: './src',
    paths: ['./']
  })
    .transform(babelify)
    .bundle()                   
    .pipe(source('scala-sdk.js'))
    .pipe(buffer())
    .pipe(replace('http://localhost:9000', argv.baseUrl || 'http://localhost:9000'))
    .pipe(gulp.dest('./build/webbrowser'));
});
gulp.task('default', ['build-node', 'build-webbrowser']);
