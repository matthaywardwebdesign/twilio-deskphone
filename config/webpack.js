const path = require( 'path' );
const webpack = require( 'webpack' );
const setup = require( './setup' );

module.exports = () => {
  const isProd = process.env && process.env.production;
  console.log( "Is Production:", isProd ? 'Yes' : 'No' );

  const config = {
    context: path.resolve( __dirname, '../src' ),
    entry: path.resolve( __dirname, '../src/views/Root.jsx' ),
    output: {
      path: path.resolve( __dirname, '../dist' ),
      filename: 'js/[name].[hash].min.js',
    },
    target: 'electron-renderer',
    devtool: !isProd && 'eval',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node-modules/,
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: [['env', { modules: false, targets: { node: 7 } }]]
          }
        },
        {
          test: /\.json$/,
          use: 'json-loader',
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader', 'sass-loader' ],
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        }
      ],
    },
    resolve: {
      alias: {
        views: path.resolve( __dirname, '../src/views' ),
        config: path.resolve( __dirname, '../src/config' ),
        styles: path.resolve( __dirname, '../src/styles' ),
        constants: path.resolve( __dirname, '../src/constants' ),
        static: path.resolve( __dirname, '../src/static' ),
      },
      extensions: [ '.js', '.jsx' ],
    },
    plugins: setup( isProd ),
    devServer: {
      contentBase: path.resolve( __dirname, '../dist' ),
      port: process.env.PORT || 3000,
      historyApiFallback: true,
      hot: !isProd,
      inline: !isProd,
      compress: isProd,
    }
  };

  return config;
}
