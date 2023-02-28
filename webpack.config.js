// Webpack uses this to work with directories
const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports = {
    plugins: [
        new NodePolyfillPlugin()
    ],
  // Path to your entry point. From this file Webpack will begin its work
  entry: './src/index.js',

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js'
  },

  resolve: {
    fallback: {
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "timers": require.resolve("timers-browserify")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
      },
        {
            test: /\.(png|jpe?g|gif)$/i,
            use: [
                {
                loader: 'file-loader',
                },
            ],
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
    ],
        
  },

  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on the final bundle. For now, we don't need production's JavaScript 
  // minifying and other things, so let's set mode to development
  mode: 'development'
};