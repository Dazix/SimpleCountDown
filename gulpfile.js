// Include the required tools used on tasks
var gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  saveLicense = require("uglify-save-license"),
  babel = require("gulp-babel"),
  postcss = require("gulp-postcss"),
  cleanCSS = require("gulp-clean-css"),
  cssbeautify = require("gulp-cssbeautify"),
  autoprefixer = require("autoprefixer"),
  del = require("del");
less = require("gulp-less");

// function swallowError(error) {
//   console.log(error);
//   this.emit("end");
// }
var Server = require("karma").Server;
var browserSync = require("browser-sync").create();

// Specify the Source files
var SRC_JS = "src/js/*.js";
var SRC_CSS = "src/css/*.css";
var SRC_LESS = "src/less/*.less";

// Specify the Destination folders
var DEST_JS = "dist/js";
var DEST_CSS = "dist/css";
var DEST_LESS = "dist/css";

// Example pages
var EXAMPLE_HTML = "examples/*.html";



function compile_js(cb) {
  gulp
    .src(SRC_JS)
    .pipe(
      babel({
        presets: ["@babel/env"],
        plugins: ["@babel/plugin-transform-modules-umd"],
      })
    )
    .pipe(
      uglify({
        mangle: true,
        compress: true,
      })
    )
    .pipe(rename("countDown.min.js"))
    .pipe(gulp.dest(DEST_JS));

  cb();
}

// Compline less
function compile_less(cb) {
  gulp
    .src(SRC_LESS)
    .pipe(less({ strictMath: true }))
    // .on("error", swallowError)
    .pipe(cleanCSS())
    .pipe(rename("style.css"))
    .pipe(gulp.dest(DEST_LESS));
  cb();
}

// BUILD CSS
function build_css(cb) {
  gulp
    .src(SRC_CSS)
    .pipe(postcss([autoprefixer()]))
    .pipe(cssbeautify({ autosemicolon: true }))
    .pipe(gulp.dest(DEST_CSS))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(DEST_CSS));
  cb();
}

// LINT
function lint_js(cb) {
  gulp
    .src(SRC_JS)
    .pipe(jshint({ esversion: 8 }))
    .pipe(jshint.reporter("default"));
  cb();
}

// CLEAN
function clean_js(cb) {
  del.sync([DEST_JS]);
  cb();
}

function clean_css(cb) {
  del.sync([DEST_CSS]);
  cb();
}

function clean_less(cb) {
  del.sync([DEST_LESS]);
  cb();
}

// WATCH
function watch(cb) {
  // gulp.watch(SRC_JS, build_js);
  gulp.watch(SRC_CSS, build_css);
  gulp.watch(SRC_LESS, compile_less);
  gulp.watch(SRC_JS, compile_js);

  cb();
}

// SERVE
function serve(cb) {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: ["examples", "dist"],
      index: "index.html",
    },
  });

  // gulp.watch(SRC_JS, build_js);
  gulp.watch(SRC_CSS, build_css);
  gulp.watch(SRC_LESS, compile_less);
  gulp.watch(SRC_JS, compile_js);

  gulp
    .watch([DEST_JS, DEST_CSS, SRC_LESS, EXAMPLE_HTML])
    .on("change", browserSync.reload);

  cb();
}

// TEST
function test(cb) {
  new Server(
    {
      configFile: __dirname + "/karma.conf.js",
      singleRun: true,
    },
    done
  ).start();

  cb();
}

// EXPORT methods
exports.clean = gulp.parallel(clean_js, clean_css, clean_less);
exports.build = gulp.parallel(
  gulp.series(clean_js, lint_js, compile_js),
  gulp.series(clean_css, build_css),
  gulp.series(clean_less, compile_less)
);
exports.lint = lint_js;
exports.watch = watch;
exports.test = test;
exports.serve = serve;
exports.default = serve;
