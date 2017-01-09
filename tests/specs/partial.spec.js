/* global describe fdescribe xdescribe it fit xit
describeTable fdescribeTable xdescribeTable
entry fentry xentry
expect bracket
*/

describe('Partials', () => {
  it('should accept partials', () => {
    const template = bracket.compile('tmpl-test [[# partial(\'tests/fixtures/partial.brkt.html\') ]]');
    const result = template();
    expect(result).toAlmostEqual('tmpl-test tmpl-partial');
  });

  it('should accept partials within layout', () => {
    const template = bracket.compile(
      `---
master: tests/fixtures/master.brkt.html
---
[[## body1()
  [[# partial('tests/fixtures/partial.brkt.html') ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-partial');
  });

  describeTable('passing models',
    (arg, resultString) => {
      const template = bracket.compile(
        `tmpl-test [[# partial('tests/fixtures/partial-arg.brkt.html', ${arg}) ]]`,
        {
          path: __dirname,
        },
      );
      const result = template();
      expect(result).toAlmostEqual(resultString);
    },
    entry('should support string', '\'test\'', 'tmpl-test tmpl-partial test'),
    entry('should support null', 'null', 'tmpl-test tmpl-partial null'),
    entry('should support undefined', 'undefined', 'tmpl-test tmpl-partial undefined'),
    entry('should support undefined (implicit)', '', 'tmpl-test tmpl-partial undefined'),
    entry('should support number', '123', 'tmpl-test tmpl-partial 123'),
    entry('should support boolean', 'true', 'tmpl-test tmpl-partial true'),
  );

  xit('should detect circular deps');
  xit('should detect file not found');
  xit('should use the same settings if custom is passed');
  xit('should be able to pass parent model');
});
