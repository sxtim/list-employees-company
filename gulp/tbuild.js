const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const cssbeautify = require("gulp-cssbeautify")
const stripCssComments = require("gulp-strip-css-comments")
const plumber = require("gulp-plumber")
const rigger = require("gulp-rigger")
const uglify = require("gulp-uglify")
const autoprefixer = require("gulp-autoprefixer")

function build(cb) {
	gulp.src("../src/js/lib/**").pipe(gulp.dest("../dist/assets/js"))

	gulp.src("../src/img/**").pipe(gulp.dest("../dist/assets/img"))

	gulp.src("../src/fonts/**").pipe(gulp.dest("../dist/assets/fonts"))

	gulp
		.src(["../src/css/*.scss", "!../src/css/vars.scss"])
		.pipe(sass.sync().on("error", sass.logError))
		.pipe(gulp.dest("../dist/assets/css"))
		.pipe(
			autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
				cascade: true,
			})
		)
		.pipe(cssbeautify())
		.pipe(stripCssComments())
		.pipe(gulp.dest("../dist/assets/css"))

	gulp.src("../src/css/reset.css").pipe(gulp.dest("../dist/assets/css"))

	gulp.src(["../src/*.html"]).pipe(plumber()).pipe(gulp.dest("../dist/"))

	gulp
		.src(["../src/js/*.js"])
		.pipe(rigger())
		.pipe(uglify())
		.pipe(gulp.dest("../dist/assets/js"))

	cb()
}
module.exports = build
