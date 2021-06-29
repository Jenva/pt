var webpack = require('webpack');
module.exports = {
    entry: [
      './src/main.js',
    ],
    alias: {
      '@': './src'
    },
    output: {
      path: './build',
      filename: 'bundle.js'
    },
    module: {
      rules: {
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
    },
    resolve:{
        extensions:['','.js','.json']
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ]
};