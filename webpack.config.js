const path = require("path")
const { VueLoaderPlugin } = require("vue-loader")

module.exports = {
	mode: "development",
	output: {
		filename: "app.js",
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
			},
			{
				test: /\.s[ac]ss$/i,
				use: ["vue-style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.css$/,
				use: ["vue-style-loader", "css-loader"],
			},
		],
	},
	plugins: [new VueLoaderPlugin()],
	resolve: {
		extensions: [".js", ".vue"],
		alias: {
			"@": path.resolve(__dirname, "src/js"),
		},
	},
}
