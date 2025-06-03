const gulp  = require('gulp');
const build = require('./tbuild');
const serve = require('./tserve');

gulp.task('build', build);
gulp.task('serve', serve);