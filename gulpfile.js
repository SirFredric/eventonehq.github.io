'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const pump = require('pump')
const del = require('del')
const cleanCSS = require('gulp-clean-css')
const changed = require('gulp-changed')
const imagemin = require('gulp-imagemin')

const paths = {
  coreJS: ['js/app/*.js'],

  libJS: [
    'js/bootstrap.js',
    'js/ripples.js',
    'js/material.js',
    'js/wow.js',
    'js/jquery.mmenu.min.all.js',
    'js/count-to.js',
    'js/jquery.inview.min.js',
    'js/classie.js',
    'js/jquery.nav.js',
    'js/smooth-on-scroll.js',
    'js/smooth-scroll.js',
    'js/main.js'
  ],

  coreLess: [''],

  libCSS: [
    'css/bootstrap.min.css',
    'css/material.min.css',
    'css/ripples.min.css',
    'css/responsive.css',
    'css/animate.css'
  ],
  outputFolders: [
    // supports the cleaning
    'dist/css/*',
    'dist/js/*',
    'dist/sourcemaps/*'
  ]
}

// Static Server
gulp.task('serve', () => {
  const port = 4000
  browserSync.init({
    port: port,
    ui: {
      port: port + 1
    },
    server: './'
  })
})

gulp.task('default', ['serve'])

gulp.task('watch', ['serve'], () => {
  // Watch for changes in `app` folder
  gulp.watch('dist/**/*.*').on('change', browserSync.reload)

  // Watch .css files
  gulp.watch('css/**/*.css', ['css'])

  // Watch .js files
  gulp.watch('js/**/*.js', ['js'])

  // Watch image files
  gulp.watch('img/**/*', ['images'])
})

gulp.task('all', ['clean'], () => {
  gulp.start('build')
})

// Run all combine and minify tasks for css and js.
gulp.task('build', ['css', 'js', 'fonts', 'images'], () => {
  console.info('Running CSS and JS tasks.')
})

// Run all fonts tasks.
gulp.task('fonts', () => {
  return gulp.src(['fonts/*']).pipe(gulp.dest('dist/fonts/'))
})

// Run all CSS tasks.
gulp.task('css', ['minify-css', 'minify-custom-css'], () => {
  console.info('Running CSS tasks.')
})

// Concat CSS files.
gulp.task('concat-css', () => {
  return gulp
    .src(paths.libCSS)
    .pipe(concat('lib.css'))
    .pipe(gulp.dest('./dist/css/'))
})

// Minify CSS files.
gulp.task('minify-css', ['concat-css'], () => {
  return gulp
    .src('dist/css/lib.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('minify-custom-css', () => {
  return gulp
    .src('css/app/main.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./dist/css/'))
})

// Run all JS tasks.
gulp.task('js', ['uglify-js'], () => {
  console.info('Running JS tasks.')
})

// Concat JS files.
gulp.task('concat-js', () => {
  return gulp
    .src(paths.libJS)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('./dist/js/'))
})

// Uglify JS files.
gulp.task('uglify-js', ['concat-js'], cb => {
  pump([gulp.src('dist/js/lib.js'), uglify(), gulp.dest('./dist/js/')], cb)
})

gulp.task('images', () => {
  const imgSrc = 'img/*.*'
  const imgDst = 'dist/img'

  gulp
    .src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst))
})

// Clean up the dist folder.
gulp.task('clean', () => {
  return del(['dist/'])
})
