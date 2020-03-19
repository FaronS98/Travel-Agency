var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');

gulp.task('default', function(done){
    return runSequence(
        [
            'build'
        ],
        [
            'watch'
        ],
        done
    ); 
});

// SASS

gulp.task('sass', function(){
    return gulp.src('./assets/styles/main.scss')
        .pipe(sass({
                "errLogToConsole": true
            }).on('error', sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(cssnano({zindex: false}))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./dist'))
});

// JAVASCRIPT

gulp.task("js", function(){
    return browserify('./assets/scripts/main.js')
    .transform('babelify',{
        presets: ['es2015'],
    })
    .bundle()
    .pipe(source('main.js', './dist'))
    .pipe(buffer())
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./dist'))
});


// WATCH

gulp.task('watch', ['browserSync'], function(){
    gulp.watch('./assets/styles/**/*', ['sass', browserSync.reload]);
    gulp.watch('./assets/scripts/main.js', ['js', browserSync.reload]);
    gulp.watch('*.html', [browserSync.reload]);
});



// CLEAN

gulp.task('clean', function(){
    del(['./dist']);
});

// BROWSER SYNC

gulp.task('browserSync', function(){
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

// BUILD

gulp.task('build', function(done){
    return runSequence(
        [
            'clean'
        ],
        [
            'sass',
            'js'
        ],
        done
    );
}); 
