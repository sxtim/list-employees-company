const gulp = require("gulp")
// const browserSync       = require('browser-sync').create();
// const reload            = browserSync.reload;
const sass = require("gulp-sass")(require("sass"))
const cssbeautify = require("gulp-cssbeautify")
const stripCssComments = require("gulp-strip-css-comments")
const plumber = require("gulp-plumber")
const rigger = require("gulp-rigger")
const uglify = require("gulp-uglify")
const autoprefixer = require("gulp-autoprefixer")
const webpack = require("webpack-stream")
const webpackConfig = require("../webpack.config.js")

const express = require("express")
const app = express()
const http = require("http")
const https = require("https")
const fs = require("fs")

const www = "../dist"

const httpsOptions = {
	key: fs.readFileSync("./ssl/localhost.key"),
	cert: fs.readFileSync("./ssl/localhost.crt"),
}

function serve(cd) {
	app.use(express.static(www))

	app.get("*", (req, res) => {
		res.sendFile(`index.html`, { root: www })
	})
	app.post("*", (req, res) => {
		res.sendFile(`index.html`, { root: www })
	})

	http.createServer(app).listen(3000)
	https.createServer(httpsOptions, app).listen(3001)

	// browserSync.init({
	//     server: {
	//         baseDir: __dirname.replace('gulp', '')
	//     },
	//     https: {
	//         key: "./ssl/localhost.key",
	//         cert: "./ssl/localhost.crt"
	//     }
	// });

	gulp.watch(["../src/css/*.scss", "!../src/css/vars.scss"], done => {
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
		// .pipe(browserSync.reload({stream: true}))
		done()
	})
	gulp.watch(["../src/*.html"], done => {
		gulp.src(["../src/*.html"]).pipe(plumber()).pipe(gulp.dest("../dist/"))
		done()
	})
	gulp.watch(["../src/js/**/*.js", "../src/js/**/*.vue"], done => {
		gulp
			.src(["../src/js/app.js"])
			.pipe(plumber())
			.pipe(webpack(webpackConfig))
			.pipe(gulp.dest("../dist/assets/js"))
		done()
	})
	// gulp.watch("../dist/*.html").on("change", reload);
	// gulp.watch("../assets/css/*.css").on("change", reload);
	// gulp.watch("../assets/js/*.js").on("change", reload);
	cd()
}
module.exports = serve
