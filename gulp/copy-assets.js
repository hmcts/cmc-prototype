/*
  copy.js
  ===========
  copies images and javascript folders to public
*/

var gulp = require('gulp')
var config = require('./config.json')

gulp.task('copy-assets', function () {
  return gulp.src(['!' + config.paths.assets + 'sass{,/**/*}',
    config.paths.assets + '/**'])
  .pipe(gulp.dest(config.paths.public))
})

gulp.task('copy-npm-assets', function () {
  return gulp.src(['!' + config.paths.assets + 'sass{,/**/*}',
    config.paths.npmAssets + '/moment/moment.js'])
    .pipe(gulp.dest(config.paths.public + 'javascripts'))
})

gulp.task('copy-documentation-assets', function () {
  return gulp.src(['!' + config.paths.docsAssets + 'sass{,/**/*}',
    config.paths.docsAssets + '/**'])
  .pipe(gulp.dest(config.paths.public))
})
