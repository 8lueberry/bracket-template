import webpack from 'webpack'; // eslint-disable-line import/no-extraneous-dependencies
import webpackConfig from './webpack.conf';

function buildBrowser() {
  console.log('Building browser..');
  webpack(webpackConfig.browser)
    .run((err, stats) => {
      if (err) {
        console.log('Error running webpack');
        return;
      }

      console.log('Done (browser)');
      console.log(stats.toString(webpackConfig.stats));
    });
}

function buildNode() {
  console.log('Building node..');
  webpack(webpackConfig.node)
    .run((err, stats) => {
      if (err) {
        console.log('Error running webpack');
        return;
      }

      console.log('Done (node)');
      console.log(stats.toString(webpackConfig.stats));
    });
}

buildNode();
buildBrowser();
