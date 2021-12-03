/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const WebpackBundleAnalyzer =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = (env, argv) => {
    return {
        entry: './client/index.tsx',
        target: 'web',
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            clean: true,
        },
        devServer: {
            static: './dist',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                },
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'source-map-loader',
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './dist/',
                    },
                },
                {
                    test: /\.css$/i,
                    include: path.resolve(__dirname, 'client'),
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './client/index.html',
                filename: './index.html',
                title: 'Development',
            }),
            new MiniCssExtractPlugin({
                filename: './client/yourfile.css',
            }),
            new ESLintPlugin({
                extensions: ['js', 'jsx', 'ts', 'tsx'],
            }),
            new NodePolyfillPlugin(),
            new WebpackBundleAnalyzer({
                analyzerMode: 'disabled',
                generateStatsFile: true,
                statsOptions: { source: false },
            }),
        ],
    }
}
