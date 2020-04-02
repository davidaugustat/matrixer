const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const fs = require("fs");

// html template files:
const htmlHeaderEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/header-en.html"));
const htmlFooterEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/footer-en.html"));
const htmlHeadTag= fs.readFileSync(path.resolve(__dirname, "source/html/templates/head-tag.html"));
const htmlBodyTag = fs.readFileSync(path.resolve(__dirname, "source/html/templates/body-tag.html"));
const htmlInputOutputFormEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/input-output-form-en.html"));
const htmlInstructionsEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/instructions-en.html"));

module.exports = {
  mode: "development",
    entry: path.resolve(__dirname, "source/main.js"),
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
            header: htmlHeaderEn,
            footer: htmlFooterEn,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag,
            inputOutputFormEn: htmlInputOutputFormEn,
            instructionsEn: htmlInstructionsEn
        }),
        new CopyPlugin([
            {from: path.resolve(__dirname, "source/css"), to: "css"},
            {from: path.resolve(__dirname, "source/img"), to: "img"}
        ])
    ]
};