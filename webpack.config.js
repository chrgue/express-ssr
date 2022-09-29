const path = require('path');
const DefinePlugin = require("webpack").DefinePlugin;
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require('glob');
const nodeExternals = require("webpack-node-externals");

const getConfig = modulePath => {

    const moduleId = path.basename(modulePath).replace(/\.[^/.]+$/, "");

    return ({
        entry: {[moduleId]: './src/client'},
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css?$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"]
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                module: path.resolve(__dirname, modulePath)
            }
        },
        plugins: [
            new DefinePlugin({
                MODULE_ID: JSON.stringify(moduleId)
            }),
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css"
            }),
            new WebpackManifestPlugin({
                fileName: `${moduleId}-manifest.json`
            })
        ],
        mode: "development",
        output: {
            filename: `client-${moduleId}-[contenthash].js`,
            path: path.resolve(__dirname, 'dist', 'public'),
            publicPath: "static"
        }
    });
};

const serverConfig = {
    entry: {
        server: {import: './src/server', filename: '[name].js'}
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css?$/,
                use: ["css-loader"]
            },
            {
                test: /\.ejs?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'templates/[name][ext]'
                }
            },
            {
                test: /\.env?$/,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    mode: "development",
    target: 'node',
    externals: [nodeExternals()]
};

const configs = glob.sync("src/server/pages/*.tsx").map((it) => getConfig(it));
configs.push(serverConfig);

module.exports = configs;