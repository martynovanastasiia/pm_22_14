const gulp = require("gulp");
const { src, dest, series, parallel, watch } = require('gulp');
const file_include = require('gulp-file-include')
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// html task
const html_task = () =>  src('app/index.html')
    .pipe(file_include({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(dest('dist'))
.pipe(browserSync.stream());


//js task
const js_task = () => src('app/js/*.js')
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());


//scss task
const scss_task = () => {
    return src('app/scss/*.scss') // Вибір усіх файлів SCSS
        .pipe(concat('style.scss')) // Об'єднання всіх SCSS у один файл
        .pipe(sass()) // Компіляція SCSS у CSS
        .pipe(cssnano()) // Мінімізація CSS
        .pipe(rename({suffix: '.min'})) // Додавання суфіксу .min до файлу
        .pipe(dest('dist/css')) // Збереження результату як єдиного файлу
        .pipe(browserSync.stream());
};

//imgs task
const img_task = () =>  src('app/img/*.+(jpg|jpeg|png|gif)', {encoding: false})
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true
    }))
    .pipe(dest('dist/imgs'))
    .pipe(browserSync.stream());



// BrowserSync task
const browserSync_task = () => browserSync.init(
    {
        server: {
            baseDir: './dist'
        },
        cache: false
    });

//watch task
const watch_task = () => {
    browserSync_task();
    watch('app/*.html', parallel(html_task));
    watch('app/scss/*.scss', parallel(scss_task)); // Всі SCSS тепер об'єднуються в один файл
    watch('app/js/*.js', parallel(js_task));
    watch('app/imgs/*.+(jpg|jpeg|png|gif)', img_task);
}

exports.default = series(html_task, scss_task, img_task, watch_task,js_task, browserSync_task );