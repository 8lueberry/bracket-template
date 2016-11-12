import karma from 'karma';
import path from 'path';

console.log('Running specs in browser..');
new karma.Server({
  configFile: path.join(__dirname, '/karma.conf.js'),
}, (exitCode) => {
  console.log(`Karma exited with code ${exitCode}`);
})
  .start();
console.log('Running specs in browser.. done');
