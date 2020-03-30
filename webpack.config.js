const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const fs = require("fs");

// html template files:
const htmlHeader = fs.readFileSync(path.resolve(__dirname, "source/html/templates/header.html"));
const htmlFooter = fs.readFileSync(path.resolve(__dirname, "source/html/templates/footer.html"));

module.exports = {
  mode: "development",
    entry: path.resolve(__dirname, "source/main2.js"),
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "distribution")
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "source"),
            path.resolve(__dirname, "node_modules")
        ]
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: "index.html",
            template: path.resolve(__dirname, "source/html/index.html"),
            chunks: ['main'],
            header: htmlHeader,
            footer: htmlFooter
        }),
        new CopyPlugin([
            {from: path.resolve(__dirname, "source/css"), to: "css"}
        ])
    ]
};