const gulp = require('gulp');
const electron = require('electron-connect').server.create();
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const tscConfig = require('./tsconfig.json');
const sass = require('gulp-sass');

//Start Electron server
gulp.task('server', function () {
  // Start browser process 
  electron.start();
});

// Compile Typescript files to JavaScript
gulp.task('compileScript', function () {
  var tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('src/angularjs'));
});

//Compile SASS files to CSS
gulp.task('compileCSS', function () {
  return gulp.src('./src/resources/styleSheets/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./src/resources/styleSheets/css'));
});

// Watch for changes in files
gulp.task('watch', () => {
  gulp.watch('src/angular/**/*.ts', ['compileScript']);
  gulp.watch('./src/resources/styleSheets/sass/**/*.scss', ['compileCSS']);
});

gulp.task('build', ['compileCSS', 'compileScript'])
gulp.task('start', ['server', 'watch']);
