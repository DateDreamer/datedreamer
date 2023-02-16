const path = require('path');

module.exports = {
    entry: "./src/index.ts",
    mode: "production",
    output: {
        filename: "datedreamer.js",
        path: path.resolve(__dirname,'dist'),
        globalObject: 'this',
        library: {
            name: "datedreamer",
            type: "umd"
        }
    },
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