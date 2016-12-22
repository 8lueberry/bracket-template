/* global describe fdescribe xdescribe it fit xit
describeTable fdescribeTable xdescribeTable
entry fentry xentry
expect bracket
*/

describe('Customisation', () => {
  it('should support renaming of arg', () => {
    const conf = { varname: 'custom' };
    const template = bracket.compile('tmpl-[[= custom ]]', conf);
    const result = template('test');
    expect(result).toAlmostEqual('tmpl-test');
  });

  it('should support multiple args', () => {
    const conf = { varname: 'model1,model2' };
    const template = bracket.compile('tmpl-[[= model1 ]]-[[= model2 ]]', conf);
    const result = template('test1', 'test2');
    expect(result).toAlmostEqual('tmpl-test1-test2');
  });

  it('should support changing to curly', () => {
    const conf = {
      evaluate: /\{\{([\s\S]+?(\}?)+)}}/g,
      interpolate: /\{\{=([\s\S]+?)}}/g,
      block: /\{\{#\s*([\w]+)\(([\s\S]*?)\)\s*}}/g,
      blockDef: /\{\{##\s*([\w]+)\(([\s\S]*)\)\s*[\n]([\s\S]*)\n\s*#}}/g,
    };
    const template = bracket.compile(`tmpl-{{# block1('test') }}
{{## block1(arg)
{{= arg }}-{{ if (model.arg1 < model.arg2) { }}{{= model.arg2 }}{{ } }}
#}}`,
      conf);
    const result = template({ arg1: 123, arg2: 456 });
    expect(result).toAlmostEqual('tmpl-test-456');
  });

  describe('Helpers', () => {
    it('should support simple helper', () => {
      const conf = {
        helpers: {
          testFunc: () => 'tmpl-helper',
        },
      };
      const template = bracket.compile('tmpl-test [[# testFunc() ]]', conf);
      const result = template();
      expect(result).toAlmostEqual('tmpl-test tmpl-helper');
    });

    it('should support helper with arg', () => {
      const conf = {
        helpers: {
          testFunc: arg => `tmpl-helper ${arg}`,
        },
      };
      const template = bracket.compile('tmpl-test [[# testFunc(\'helper-arg\') ]]', conf);
      const result = template();
      expect(result).toAlmostEqual('tmpl-test tmpl-helper helper-arg');
    });

    it('should support helper with multiple arg', () => {
      const conf = {
        helpers: {
          testFunc: (arg1, arg2, arg3) => `tmpl-helper ${arg1} ${arg2} ${arg3}`,
        },
      };
      const template = bracket.compile('tmpl-test [[# testFunc(\'helper-arg\', \'helper-arg2\', \'helper-arg3\') ]]', conf);
      const result = template();
      expect(result).toAlmostEqual('tmpl-test tmpl-helper helper-arg helper-arg2 helper-arg3');
    });
  });
});
