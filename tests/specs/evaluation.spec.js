/* global describe fdescribe it fit expect bracket */

describe('Evaluation', () => {
  it('should evaluate if', () => {
    const template = bracket.template('tmpl-[[ if(model.show) { ]][[= model.test ]][[ } ]]');
    const result = template({ show: true, test: 'test' });
    expect(result).toEqual('tmpl-test');
  });

  it('should evaluate for', () => {
    const tmpl = bracket.template('tmpl-[[ for(var i=0; i<model.tests.length; i++) { ]][[= model.tests[i] ]][[ } ]]');
    const result = tmpl({ tests: ['test1', 'test2', 'test3'] });
    expect(result).toEqual('tmpl-test1test2test3');
  });

  it('should allow variable definitions', () => {
    const template = bracket.template("[[ var test = 'test'; ]]tmpl-[[= test ]]");
    const result = template();
    expect(result).toEqual('tmpl-test');
  });
});
