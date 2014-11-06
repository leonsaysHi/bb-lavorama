var 
   gulp = require('gulp')
  ,bower = require('gulp-bower')
  ,sass = require('gulp-ruby-sass')
  ,watch = require('gulp-watch')
  ,connect = require('gulp-connect')
  ,historyApiFallback = require('connect-history-api-fallback')
;


gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./app/lib/'))
});

gulp.task('styles', function() {
  return gulp.src('./styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/styles'))
  ;
});

gulp.task('watch', function() {
  return gulp.watch('./styles/*.scss', ['styles']);
});

gulp.task('connect', function() {
  connect
    .server({
      root: 'app',
      livereload: true,
      middleware: function(connect, opt) {
        return [ historyApiFallback ];
      }
    });
});


gulp.task('init', ['bower', 'styles']);
gulp.task('dev', ['styles', 'watch', 'connect']);