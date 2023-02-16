const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    devtool: 'inline-source-map',
    output: {
        filename: "datedreamer.js",
        path: path.resolve(__dirname,'dist'),
        globalObject: 'this',
        library: {
            name: "datedreamer",
            type: "umd"
        }
    },
    devServer: {
        static: './public'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'DateDreamer Development',
            template: './public/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader','sass-loader']
            },
            {
                test: /\.tsx?$/i,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
}