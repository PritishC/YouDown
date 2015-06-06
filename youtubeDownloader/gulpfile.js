'use strict';

var gulp = require('gulp');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');

gulp.task('default', ['lint', 'test']);

gulp.task('test', function() {
  //Be sure to return the stream
  return gulp.src('_')
  .pipe(karma({
    // TODO
    configFile: __dirname + '/tests/my.conf.js',
    action: 'run'
  }))
  .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
  });

gulp.task('lint', function() {
  return gulp.src(['www/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
  });
