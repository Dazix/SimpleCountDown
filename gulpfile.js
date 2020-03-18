const gulp = require('gulp4');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const babel = require('gulp-babel');
const less = require('gulp-less');
const del = require('del');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

let compileLess = (path, name) => {
    return gulp.src('src/style.less')
        .pipe(less({ strictMath: true }))
        .on('error', swallowError)
        .pipe(cleanCSS())
        .pipe(rename(name))
        .pipe(gulp.dest(path));
};

let compileJs = (path, name) => gulp.src('src/countDown.js')
    .pipe(babel({
        presets: ['@babel/env'],
        plugins: ['@babel/plugin-transform-modules-umd']
    }))
    .pipe(uglify({
        mangle: true,
        compress: true
    }))
    .pipe(rename(name))
    .pipe(gulp.dest(path));

function swallowError(error) {
    console.log(error);
    this.emit('end');
}

gulp.task('js', () => compileJs('build/', 'countDown.js'));
gulp.task('js:watch', () => gulp.watch('src/countDown.js'), gulp.series('js'));

gulp.task('less', () => compileLess('build/', 'style.css'));
gulp.task('less:watch', () => gulp.watch('./src/style.less', gulp.series('less')));

gulp.task('example:less', () => compileLess('example/', 'style.css'));
gulp.task('example:compile_js', () => compileJs('example/', 'countDown.min.js'));

gulp.task('dist:less', () => compileLess('dist/', 'countDown.min.css'));
gulp.task('dist:compile_js', () => compileJs('dist/', 'countDown.min.js'));

gulp.task('develop', gulp.parallel(gulp.series('less', 'less:watch'), gulp.series('js', 'js:watch')));

gulp.task('update:example', gulp.parallel('example:less', 'example:compile_js'));
gulp.task('update:dist', gulp.parallel('dist:less', 'dist:compile_js'));
gulp.task('update:all', gulp.parallel('update:dist', 'update:example'));

gulp.task('clean', () => del(['build/**/*',]));
