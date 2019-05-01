var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    gzip = require('gulp-gzip'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify-es').default,
    rename = require('gulp-rename');

//// MINIFY TASKS ////
//CSS
const mincss = () => {
    gulp.src('.app/public/website/css/main.css')
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('.app/public/website/css/'));
}

gulp.task('mincss', async () => {
    mincss();
})

//JS
gulp.task('jsmin', async () => {
    gulp.src('./app/public/website/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./app/public/website/js')),

    gulp.src('./app/public/admin/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./app/public/admin/js'))
})

//IMG
gulp.task('imagesmin', async () => {
    gulp.src('images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('images'));
});

gulp.task('webp', async () => {
    gulp.src('images/**/*')
        .pipe(webp({
            quality: 100
        }))
        .pipe(gulp.dest('images'))
});

//// SCSS TASKS ////
gulp.task('sass', async () => {
    gulp.src('./app/public/website/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./app/public/website/css/'))
});

gulp.task('listensass', async () => {
    gulp.watch('./app/public/website/scss/**/*.scss', gulp.series('sass'))
});

gulp.task('sassadmin', async () => {
    gulp.src('./app/public/admin/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./app/public/admin/css/'))
});

gulp.task('listensassadmin', async () => {
    gulp.watch('./app/public/admin/scss/**/*.scss', gulp.series('sassadmin'))
});


/// GZIP TASKS ////
gulp.task('gzipcss', async () => {
    gulp.src('./css/main.css')
        .pipe(gzip())
        .pipe(gulp.dest('./css/'));
})

gulp.task('gzipjs', async () => {
    gulp.src('./js/main.js')
        .pipe(gzip())
        .pipe(gulp.dest('./js/'));
})

