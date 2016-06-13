import webpackConfig from './webpack.config';
import webpack from 'webpack';

function build() {
  console.log('Building..');
  webpack(webpackConfig)
    .run((err, stats) => {
      if (err) {
        console.log('Error running webpack');
        return;
      }

      console.log(stats.toString(webpackConfig.stats));
      console.log('Done');
    });
}

build();
