// setting general settings
//var src = './pattern-library/twig/';
var src = './pattern-library/mustache/';
//var src = './pattern-library/'
var dest = '../demo/'

// gulp modules
var gulp = require('gulp')
var chewingum = require('chewingum')
var browserSync = require('browser-sync').create()
var ghPages = require('gulp-gh-pages')
// for STYLE
var sass = require('gulp-sass')
// for JavaScript
var concat = require('gulp-concat')

// Pattern Library
// For each template file (e.g. breadcrumbs.twig) will build a documentation file.
gulp.task('chewingum', function () {
  chewingum({
    location: {
      src: src,
      dest: dest
      //root: '/'
      //root: '/chewingum/demo/'
    },
    extensions: {
      //template: '.nunjucks'
      template: '.mustache'
    },
    filterItems: [
      {
        'title': 'partials',
        'regex': 'partials'
      },
      {
        'title': 'pages',
        'regex': 'pages'
      },
      {
        'title': 'all',
        'regex': ''
      }
    ]
  })
})

// Server
// Will build server for patter-library
gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: dest
      // baseDir: '../'
    },
    port: 9999,
    open: false,
    notify: false
  })
})

// Style
// Will combine and minify all component styles
gulp.task('style', function (done) {
  return gulp.src('./style/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest + '/assets/'))
    .pipe(browserSync.stream())
})

// JavaScript
// Will combine and minify all component JavaScript files.
gulp.task('javascript', function (done) {
  return gulp.src(src + '/**/*.js')
    .pipe(concat('components.js'))
    .pipe(gulp.dest(dest + '/assets/'))
})

// Deploy to Github Pages
gulp.task('deploy', function () {
  return gulp.src(dest)
    .pipe(ghPages())
})

// FOOTER
// WATCH
gulp.task('watch', function (done) {
  gulp.watch(src + '/**/*.twig', ['chewingum'])
  gulp.watch(src + '/**/*.json', ['chewingum'])
  gulp.watch(src + '/**/*.js', ['javascript'])
  gulp.watch([src + '/**/*.scss', './style/**/*.scss'], ['style'])
})
// DEFAULT
gulp.task('default', ['chewingum', 'style', 'javascript', 'server', 'watch'])
