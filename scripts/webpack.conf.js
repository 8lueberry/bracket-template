import path from 'path';
import webpack from 'webpack'; // eslint-disable-line import/no-extraneous-dependencies
import pkg from '../package.json';

const browserConfig = {
  target: 'web',
  entry: './src/bracket.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bracket.min.js',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel',
      query: {
        // https://github.com/babel/babel-loader#options
        cacheDirectory: true,

        // https://babeljs.io/docs/usage/options/
        babelrc: false,
        comments: false,
        compact: true,
        minified: true,
        presets: [
          'es2015',
          'stage-0',
        ],
      },
      plugins: [
        'transform-runtime',
      ],
    }],
  },

  plugins: [
    // Minimize all JavaScript output of chunks
    // https://github.com/mishoo/UglifyJS2#compressor-options
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: true,
      },
    }),

    // A plugin for a more aggressive chunk merging strategy
    // https://webpack.github.io/docs/list-of-plugins.html#aggressivemergingplugin
    new webpack.optimize.AggressiveMergingPlugin(),

    // Allows you to create global constants which can be configured at compile time.
    // http://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  ],
};

const nodeConfig = {
  target: 'node',
  entry: './src/layout.js',
  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist'),
    filename: 'node.js',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel',
      query: {
        // https://github.com/babel/babel-loader#options
        cacheDirectory: true,

        // https://babeljs.io/docs/usage/options/
        babelrc: false,
        presets: [
          'es2015',
          'stage-0',
        ],
      },
      plugins: [
        'transform-runtime',
      ],
    }],
  },
  plugins: [
    // Allows you to create global constants which can be configured at compile time.
    // http://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  ],
};

export default {
  browser: browserConfig,
  node: nodeConfig,
};
