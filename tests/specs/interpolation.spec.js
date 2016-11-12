/* global describe fdescribe it fit expect bracket */

describe('Interpolation', () => {
  it('should interpolate model values', () => {
    const template = bracket.template('tmpl-[[= model.test ]]-[[= model.test2 ]]');
    const result = template({ test: 'test', test2: 'test2' });
    expect(result).toEqual('tmpl-test-test2');
  });

  it('should interpolate from 2 models', () => {
    const conf = { varname: 'model,model2' };
    const template = bracket.template('tmpl-[[= model.test ]]-[[= model2.test2 ]]', conf);
    const result = template({ test: 'test' }, { test2: 'test2' });
    expect(result).toEqual('tmpl-test-test2');
  });
});
