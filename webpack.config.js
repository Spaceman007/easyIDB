
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'index.html')
})

module.exports = {
    entry: {
        index: './hello.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.svelte$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'svelte-loader'
                        }
                    ]
            }
        ]
    },
    devServer: {
        proxy: {
            '/models': {
                target: 'http://localhost:80',
                changeOrigin: true
            }
        },
        port: '6060'
    },
    resolve: {
        extensions: ['.mjs', '.js', '.svelte']
    },
    plugins: [
        htmlPlugin
    ]
}

