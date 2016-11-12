/* global describe fdescribe it fit expect bracket */

describe('Customisation', () => {
  it('should support renaming of arg', () => {
    const conf = { varname: 'custom' };
    const template = bracket.template('tmpl-[[= custom ]]', conf);
    const result = template('test');
    expect(result).toEqual('tmpl-test');
  });

  it('should support multiple args', () => {
    const conf = { varname: 'model1,model2' };
    const template = bracket.template('tmpl-[[= model1 ]]-[[= model2 ]]', conf);
    const result = template('test1', 'test2');
    expect(result).toEqual('tmpl-test1-test2');
  });

  it('should support changing to curly', () => {
    const conf = {
      evaluate: /\{\{([\s\S]+?(\}?)+)}}/g,
      interpolate: /\{\{=([\s\S]+?)}}/g,
      block: /\{\{#\s*([\w]+)\(([\s\S]*?)\)\s*}}/g,
      blockDef: /\{\{##\s*([\w]+)\(([\s\S]*)\)\s*[\n]([\s\S]*)\n\s*#}}/g,
    };
    const template = bracket.template(`tmpl-{{# block1('test') }}
{{## block1(arg)
{{= arg }}-{{ if (model.arg1 < model.arg2) { }}{{= model.arg2 }}{{ } }}
#}}`,
      conf);
    const result = template({ arg1: 123, arg2: 456 });
    expect(result).toEqual('tmpl-test-456\n');
  });
});
