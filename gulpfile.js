var 
   gulp = require('gulp')
  // init + dev
  ,bower = require('gulp-bower')
  ,connect = require('gulp-connect')
  ,watch = require('gulp-watch')
  ,sass = require('gulp-ruby-sass')
  ,historyApiFallback = require('connect-history-api-fallback')

  // generals
  ,rename = require("gulp-rename")
  ,uglify = require('gulp-uglify')
  ,minifyCSS = require('gulp-minify-css')

  // dist
  ,htmlreplace = require('gulp-html-replace')
  ,rjs = require('gulp-requirejs')
;


gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./app/lib/'))
});

gulp.task('styles:dev', function() {
  return gulp.src('./styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/styles'))
  ;
});
gulp.task('watch', function() {
  return gulp.watch('./styles/*.scss', ['styles']);
});

gulp.task('connect:dev', function() {
  connect
    .server({
      root: 'app',
      livereload: true,
      middleware: function(connect, opt) {
        return [ historyApiFallback ];
      }
    });
});



gulp.task('requirejs', function() {
  rjs({
      baseUrl: './app/scripts/',
      mainConfigFile: './app/scripts/main.js',
      name: '../lib/almond/almond',
      include: ['main'],
      out: 'main.min.js',
      wrap:true
    })
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('indexhtml', function() {
  
});


gulp.task('copy:dist', function() {
  
  gulp
    .src(
      [
         './app/.htaccess'
        ,'./app/favicon.ico'
        ,'./app/fonts/**'
        ,'./app/images/**'
      ]
      ,{base: './app'}
    )
    .pipe(gulp.dest('./dist/'));

  return gulp.src('./app/index.html')
    .pipe(htmlreplace({
        'css': 'styles/main.min.css',
        'js': 'scripts/main.min.js',
        'body': '<body data-id="<?php echo (isset($_GET[\'d\']) ? $_GET[\'d\'] : 0)?>">'
    }))
    .pipe(rename("index.php"))
    .pipe(gulp.dest('./dist/'));

});

gulp.task('styles:dist', function() {
  return gulp.src('./app/styles/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/styles/'))
  ;
});


gulp.task('connect:dist', function() {
  connect
    .server({
      root: 'dist',
      livereload: true,
      middleware: function(connect, opt) {
        return [ historyApiFallback ];
      }
    });
});


// Init : bower
gulp.task('init', ['bower']);

// Setup dev environment into ./app : sass watch + server
gulp.task('dev', ['styles:dev', 'watch', 'connect:dev']);

// Build ./dist content : copy files + wrap AMD + minify/uglify + server
gulp.task('dist', ['copy:dist', 'requirejs', 'styles:dist', 'connect:dist']);