const path = require("path");

module.exports = {
  mode: "production",
    entry: path.resolve(__dirname, "source/main2.js"),
    //entry: "./source/main2.js",
    output: {
        filename: "bundle.js",
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
    }
};