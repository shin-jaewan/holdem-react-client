/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = (env, argv) => {
    const production = argv.mode === 'production';

    const config = {
        mode: argv.mode,
        entry: {
            index: [
                './src/app/Index.tsx',
            ],
        },
        output: {
            path: path.join(__dirname, `${production ? "../resources/dist/" : "./src/build/dist"}`),
            filename: '[name].js?v=[contenthash]',
            chunkFilename: '[name].chunk.js?v=[contenthash]',
            publicPath: '/dist/'
        },
        devtool: production ? false : 'eval-cheap-module-source-map',
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                plugins: [!production && require.resolve('react-refresh/babel')].filter(Boolean),
                            },
                        },
                    ],
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        production ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !production
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|mp4|gif|svg)$/i,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 8192,
                            },
                        },
                    ],
                },
                // {
                //     test: /\.svg$/i,
                //     issuer: /\.[jt]sx?$/,
                //     use: ['@svgr/webpack'],
                // },
            ]
        },
        devServer: {
            static: {
                directory: path.join(__dirname, './src/build'),
            },
            devMiddleware: {
                publicPath: '/dist/',
            },
            compress: true,
            port: 8000,
            historyApiFallback: true,
            liveReload: true,
            hot: true,
            open: false,
            proxy: {
                '/api': {
                    // target: 'https://dev-admin.gongsiltoday.com/',
                    target: 'http://localhost:3001/',
                    changeOrigin: true,
                    secure: false,
                    ws: true
                }
            }
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            modules: [path.resolve(__dirname, 'src'), 'node_modules'],
            alias: {
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@contexts': path.resolve(__dirname, 'src/app/contexts'),
                '@hooks': path.resolve(__dirname, 'src/app/hooks'),
                '@images': path.resolve(__dirname, 'src/app/images'),
                '@model': path.resolve(__dirname, 'src/app/models'),
                '@services': path.resolve(__dirname, 'src/app/services'),
                '@type': path.resolve(__dirname, 'src/app/types'),
                '@utils': path.resolve(__dirname, 'src/app/utils'),
                '@pages': path.resolve(__dirname, 'src/app/pages'),
                '@components': path.resolve(__dirname, 'src/app/components'),
                '@binding-model': path.resolve(__dirname, 'src/app/binding-model'),
                '@config': path.resolve(__dirname, 'src/app/config'),
                '@statics': path.resolve(__dirname, 'src/app/statics'),
            },
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false
                })
            ],
            splitChunks: {
                cacheGroups: {
                    common: {
                        test: /[\\/]node_modules[\\/](@babel|react-dom|react|react-router-dom)[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        enforce: true
                    }
                },
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: `${production ? path.join(__dirname, '/../resources/templates/index.html') : "../index.html"}`,
                template: 'src/templates/index.html',
                minify: true,
                chunks: ['index'],
                favicon: "src/assets/image/logo/favicon.ico",
            }),
            new HtmlWebpackPlugin({
                filename: `${production ? path.join(__dirname, '/../resources/templates/pin_find_id.html') : "../pin_find_id.html"}`,
                template: "src/templates/pin_find_id.html",
                minify: true,
                chunks: ['pin_find_id'],
            }),
            new HtmlWebpackPlugin({
                filename: `${production ? path.join(__dirname, '/../resources/templates/pin_reset_password.html') : "../pin_reset_password.html"}`,
                template: "src/templates/pin_reset_password.html",
                minify: true,
                chunks: ['pin_reset_password'],
            }),
            new HtmlWebpackPlugin({
                filename: `${production ? path.join(__dirname, '/../resources/templates/pin_sign_up.html') : "../pin_sign_up.html"}`,
                template: "src/templates/pin_find_id.html",
                minify: true,
                chunks: ['pin_sign_up'],
            }),
            new MiniCssExtractPlugin({
                filename: production ? '[name].css?v=[fullhash]' : '[name].css',
                chunkFilename: production ? '[id].css?v=[fullhash]' : '[id].css',
                ignoreOrder: false
            }),
            new webpack.DefinePlugin({
                profile: JSON.stringify(process.env.NODE_ENV || 'development'),
                isProduction: production
            }),
        ]
    }

    if (production) {
        config.plugins.push(new CleanWebpackPlugin())
    } else {
        config.plugins.push(new ReactRefreshWebpackPlugin())
    }

    return config
}
