"use strict";
var path = require("path");
var webpack = require("webpack");

var options = {

  entry: {
    // Le coeur de l'application
    app: ["./build/app.js"],
    // Les librairies externes
    vendor: [
      "underscore",
      "jquery",
      "backbone",
      "q",
    ]

  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/dist/",
  },

  resolve: {
    extensions: [
      ".js",
      ".json",
    ],
    modules: ["./src", "./src/js/libs", "node_modules"]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },

      {
        include: /\.pug/,
        loader: 'pug-html-loader'
      },

    ],
  },

  plugins: (
    [
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({name:"vendor", filename:"vendor.bundle.js"}),
      // On expose des proxy pour les dépendances des librairies
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        _: 'underscore',
        q: 'q',
        Backbone: 'backbone'
      }),
    ]
  ),

}

module.exports = options;
