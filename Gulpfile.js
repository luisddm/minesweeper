(function () {

  'use strict';

  const gulp = require('gulp');
  const sass = require('gulp-sass');
  const minifyCss = require('gulp-clean-css');
  const browserSync = require('browser-sync');
  const uglify = require('gulp-uglify');
  const swig = require('gulp-swig');
  const concat = require('gulp-concat');
  const changed = require('gulp-changed');
  const del = require('del');
  const plumber = require('gulp-plumber');
  const autoprefixer = require('gulp-autoprefixer');

  // Convierto SCSS a CSS, minimizo, concateno y copio el archivo style.css a dist
  gulp.task('scss', function () {
    gulp.src('scss/style.scss')
      .pipe(plumber())
      .pipe(sass({
        includePaths: [
          'scss',
          'bower_components/bootstrap-sass-official/assets/stylesheets',
          'bower_components/fontawesome/scss',
        ],
      }))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(minifyCss({
        keepSpecialComments: 0,
      }))
      .pipe(concat('style.css'))
      .pipe(gulp.dest('dist/css'));
  });

  // Minimizo el javascript, lo concateno en app.js y lo copio a dist
  gulp.task('javascript', function () {
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
        'js/*.js',
      ])
      //.pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('dist/js'));
  });

  // Construyo los HTML a partir de las plantillas Swig y las copio a dist
  gulp.task('templates', function () {
    gulp.src('templates/*.html')
      .pipe(swig({
        load_json: true,
        json_path: 'templates',
        defaults: {
          cache: false,
        },
      }))
      .pipe(gulp.dest('dist'));
  });

  // Copio las imágenes a dist
  gulp.task('images', function () {
    gulp.src('img/**')
      .pipe(changed('dist/img/**'))
      .pipe(gulp.dest('dist/img'));
  });

  // Copio las fuentes a dist
  gulp.task('fonts', function () {
    gulp.src('bower_components/fontawesome/fonts/**')
      .pipe(changed('dist/fonts/**'))
      .pipe(gulp.dest('dist/fonts'));
  });

  // Mantengo un servidor httpd que hace que el navegador se recargue cuando detecta cambios
  gulp.task('browser-sync', function () {
    browserSync.init(['dist/css/*.css', 'dist/js/*.js', 'dist/*.html', 'dist/img/**'], {
      server: {
        baseDir: 'dist',
      },
    });
  });

  // Elimino el contenido de la carpeta dist
  gulp.task('clean', function () {
    del(['dist/**']);
  });

  // Tarea por defecto para desarrollo
  gulp.task('default', ['scss', 'javascript', 'templates', 'images', 'browser-sync'], function () {
    gulp.watch('scss/*.scss', ['scss']);
    gulp.watch('js/*.js', ['javascript']);
    gulp.watch('templates/**', ['templates']);
  });

})();
