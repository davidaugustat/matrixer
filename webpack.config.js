const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const fs = require("fs");

// html template files:
const htmlHeadTag= fs.readFileSync(path.resolve(__dirname, "source/html/templates/head-tag.html"));
const htmlBodyTag = fs.readFileSync(path.resolve(__dirname, "source/html/templates/body-tag.html"));

const htmlInputOutputFormEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/input-output-form-en.html"));
const htmlInstructionsEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/instructions-en.html"));
const htmlSeoTagsEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/seo-tags-en.html"));
const htmlHeaderEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/header-en.html"));
const htmlFooterEn = fs.readFileSync(path.resolve(__dirname, "source/html/templates/en/footer-en.html"));

const htmlInputOutputFormDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/input-output-form-de.html"));
const htmlInstructionsDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/instructions-de.html"));
const htmlSeoTagsDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/seo-tags-de.html"));
const htmlHeaderDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/header-de.html"));
const htmlFooterDe = fs.readFileSync(path.resolve(__dirname, "source/html/templates/de/footer-de.html"));



module.exports = {
    mode: "production",
    //mode: "development",
    //devtool: 'inline-source-map', // <-- comment this line out when building for production
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
            template: path.resolve(__dirname, "source/html/en/index.html"),
            chunks: ['main'],
            header: htmlHeaderEn,
            footer: htmlFooterEn,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag,
            inputOutputForm: htmlInputOutputFormEn,
            instructions: htmlInstructionsEn,
            seoTags: htmlSeoTagsEn
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: "en/report-error/index.html",
            template: path.resolve(__dirname, "source/html/en/report-error.html"),
            chunks: [],
            header: htmlHeaderEn,
            footer: htmlFooterEn,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: "en/about/index.html",
            template: path.resolve(__dirname, "source/html/en/about.html"),
            chunks: [],
            header: htmlHeaderEn,
            footer: htmlFooterEn,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag
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
            instructions: htmlInstructionsDe,
            seoTags: htmlSeoTagsDe
        }),

        new HtmlWebpackPlugin({
            hash: true,
            filename: "de/report-error/index.html",
            template: path.resolve(__dirname, "source/html/de/report-error.html"),
            chunks: [],
            header: htmlHeaderDe,
            footer: htmlFooterDe,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: "de/about/index.html",
            template: path.resolve(__dirname, "source/html/de/about.html"),
            chunks: [],
            header: htmlHeaderDe,
            footer: htmlFooterDe,
            headTag: htmlHeadTag,
            bodyTag: htmlBodyTag
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "source/assets"),
                    to: "assets",
                    globOptions: {
                        ignore: [ "**/other/robots.txt" ]
                    }
                },
                {
                    from: path.resolve(__dirname, "source/assets/other/robots.txt"),
                    to: "robots.txt"
                }
            ]
        })
    ],
    devServer: {
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        }
    }
};

