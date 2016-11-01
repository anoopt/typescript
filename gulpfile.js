var config = require('./gulp.config')();
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('transpile', function(){
  gulp.src(config.allts)
    .pipe($.tsc())
    .pipe(gulp.dest(config.compiledfolder));
});

gulp.task('concat-js', function() {
  return gulp.src(config.alljs)
    .pipe($.concat(config.mergedjsfilename))
    .pipe($.uglify())
    .pipe(gulp.dest(config.mergedfolder));
});

gulp.task('minify-js', ['concat-js'], function() {
  return gulp.src(config.mergedjs)
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.uploadfolder));
});

gulp.task('upload-js-to-sp', ['minify-js'], function () {
      return gulp.src(config.uploadjs)
      .pipe($.spsave({
            siteUrl: config.spsiteurl,
            folder: config.spsitefolder
        }, config.creds));
});

gulp.task('upload-html-to-sp', function () {
      return gulp.src(config.uploadhtml)
      .pipe($.spsave({
            siteUrl: config.spsiteurl,
            folder: config.spsitefolder
        }, config.creds));
});