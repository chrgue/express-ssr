const path = require('path');
const webpack = require("webpack");
const DefinePlugin = webpack.DefinePlugin;
const NormalModuleReplacementPlugin = webpack.NormalModuleReplacementPlugin;
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require('glob');
const nodeExternals = require("webpack-node-externals");

const getConfig = () => {
    const entries = glob.sync("src/server/pages/*.tsx")
        .map((it) => path.basename(it).replace(/\.[^/.]+$/, ""))
        .map((it) => ({import: './src/client', layer: it}))
        .reduce((prev, curr) => {
            Object.assign(prev, {[curr.layer]: curr})
            return prev
        }, {});

    return ({
        entry: entries,
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
            extensions: ['.tsx', '.ts', '.js']
        },
        plugins: [
            new NormalModuleReplacementPlugin(
                /__MODULE__/,
                resource => {
                    const moduleId = resource.contextInfo.issuerLayer;
                    resource.request = resource.request.replace(/__MODULE__/, "./server/pages/" + moduleId);
                }
            ),
            new DefinePlugin({
                __MODULE_ID__: DefinePlugin.runtimeValue((ctx) => JSON.stringify(ctx.module.layer))
            }),
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css"
            }),
            new WebpackAssetsManifest({
                publicPath: (filename) => `static/${filename}`,
                entrypoints: true
            })
        ],
        mode: "development",
        output: {
            filename: `[name]-[contenthash].js`,
            path: path.resolve(__dirname, 'dist', 'public'),
            publicPath: "static"
        },
        experiments: {
            layers: true
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: "vendor",
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all'
                    }
                }
            }
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

module.exports = [getConfig(), serverConfig];