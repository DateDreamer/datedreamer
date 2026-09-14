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
                use: ['style-loader', 'css-loader'] // Or MiniCssExtractPlugin if using it in prod
            },
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.tsx?$/i,
                loader: 'esbuild-loader',
                options: {
                    loader: 'ts',
                    target: 'es2020'
                },
                exclude: /node_modules/
            }
        ]
    },   
  resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
}
