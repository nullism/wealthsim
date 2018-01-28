var path = require("path");
module.exports = [
  {
    entry: ["babel-polyfill", "./src/app.js"],
    output: {
      path: path.join(__dirname, "dist", "js"),
      filename: "app-bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: ["env"],
          }
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
          options: {
            loaders: {
              js: "babel-loader?presets[]=env",
            }
          }
        },
        {
          test: /\.css$/,
          loader: "css-loader",
        }
      ]
    },
    resolve: { alias: { vue: "vue/dist/vue.js" }},
  },
]
