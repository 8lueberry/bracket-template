import path from 'path';
import webpack from 'webpack';

const webpackConfig = {
  target: 'web',
  resolve: {
    root: path.resolve(__dirname, '..'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.json'],
  },
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bracket.min.js',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, '..'),
      ],
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
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },

  plugins: [
    // Minimize all JavaScript output of chunks
    // https://github.com/mishoo/UglifyJS2#compressor-options
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
        warnings: true,
      },
    }),

    // A plugin for a more aggressive chunk merging strategy
    // https://webpack.github.io/docs/list-of-plugins.html#aggressivemergingplugin
    new webpack.optimize.AggressiveMergingPlugin(),
  ],

  devtool: 'cheap-module-eval-source-map',
};

export default webpackConfig;
