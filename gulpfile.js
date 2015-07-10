var gulp = require('gulp');
var replace = require('gulp-replace');
var argv = require('yargs').argv;
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// player tasks
gulp.task('browserify', function(){
  return browserify('./scala.js', {
    basedir: './src',
    paths: ['./']
  })
    .bundle()
    .pipe(source('scala-sdk.js'))
    .pipe(buffer())
    .pipe(replace('http://localhost:9000', argv.baseUrl || 'http://localhost:9000'))
    .pipe(gulp.dest('./dist'));
});
gulp.task('default', ['browserify']);
