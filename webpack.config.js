const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const fs = require("fs");

// html template files:
const htmlHeadTag= fs.readFileSync(path.resolve(__dirname, "source/html/templates/head-tag.html"));
const htmlBodyTag = fs.readFileSync(path.resolve(__dirname, "source/html/templates/body-tag.html"));

const htmlInputOutputFormEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/input-output-form-en.html"));
const htmlInstructionsEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/instructions-en.html"));
const htmlHeaderEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/header-en.html"));
const htmlFooterEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/footer-en.html"));

const htmlInputOutputFormDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/input-output-form-de.html"));
const htmlInstructionsDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/instructions-de.html"));
const htmlHeaderDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/header-de.html"));
const htmlFooterDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/footer-de.html"));



module.exports = {
  mode: "development",
    entry: path.resolve(__dirname, "source/main.js"),
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "distribution"),
        publicPath: "/"
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
            inputOutputForm: htmlInputOutputFormEn,
            instructions: htmlInstructionsEn
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: "en/report-error/index.html",
            template: path.resolve(__dirname, "source/html/en/report-error/index.html"),
            chunks: [],
            header: htmlHeaderEn,
            footer: htmlFooterEn,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag,
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: "en/about/index.html",
            template: path.resolve(__dirname, "source/html/en/about/index.html"),
            chunks: [],
            header: htmlHeaderEn,
            footer: htmlFooterEn,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag,
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: "de/index.html",
            template: path.resolve(__dirname, "source/html/de/index.html"),
            chunks: ['main'],
            header: htmlHeaderDe,
            footer: htmlFooterDe,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag,
            inputOutputForm: htmlInputOutputFormDe,
            instructions: htmlInstructionsDe
        }),

        new HtmlWebpackPlugin({
            hash: true,
            filename: "de/report-error/index.html",
            template: path.resolve(__dirname, "source/html/de/report-error/index.html"),
            chunks: [],
            header: htmlHeaderDe,
            footer: htmlFooterDe,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag,
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: "de/about/index.html",
            template: path.resolve(__dirname, "source/html/de/about/index.html"),
            chunks: [],
            header: htmlHeaderDe,
            footer: htmlFooterDe,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag,
        }),
        new CopyPlugin([
            {from: path.resolve(__dirname, "source/assets"), to: "assets"},
        ])
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: "./source/html/templates",
        watchContentBase: true
    }
};