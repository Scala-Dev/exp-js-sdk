var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');

gulp.task('build-node', function () {
  return gulp.src('./src/**/*')
    .pipe(babel())
    .pipe(gulp.dest('./build/node'));
});

gulp.task('build-webbrowser', ['build-node'], function () {
  return browserify('./exp.js', {
    basedir: './build/node',
    paths: ['./']
  })
    .bundle()
    .pipe(source('exp-js-sdk.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build/webbrowser'));
});
gulp.task('default', ['build-webbrowser']);


gulp.task('test', ['build-node'], function () {
  return gulp.src('./test/**/*.spec.js')
    .pipe(mocha({ reporter: 'nyan', timeout: 10000 }))
    .once('error', function () { process.exit.bind(process, 1); })
    .once('end', function () { process.exit(); });
});
