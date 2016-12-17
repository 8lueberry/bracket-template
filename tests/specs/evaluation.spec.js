/* global describe fdescribe xdescribe it fit xit
describeTable fdescribeTable xdescribeTable
entry fentry xentry
expect bracket
*/

describe('Evaluation', () => {
  it('should evaluate if', () => {
    const template = bracket.compile('tmpl-[[ if(model.show) { ]][[= model.test ]][[ } ]]');
    const result = template({ show: true, test: 'test' });
    expect(result).toAlmostEqual('tmpl-test');
  });

  it('should evaluate for', () => {
    const template = bracket.compile('tmpl-[[ for(var i=0; i<model.tests.length; i++) { ]][[= model.tests[i] ]][[ } ]]');
    const result = template({ tests: ['test1', 'test2', 'test3'] });
    expect(result).toAlmostEqual('tmpl-test1test2test3');
  });

  it('should allow variable definitions', () => {
    const template = bracket.compile("[[ var test = 'test'; ]]tmpl-[[= test ]]");
    const result = template();
    expect(result).toAlmostEqual('tmpl-test');
  });
});
