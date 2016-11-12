import Jasmine from 'jasmine';

console.log('Running specs in node..');
const jasmine = new Jasmine();
jasmine.loadConfigFile('tests/jasmine.conf.json');
jasmine.execute();
