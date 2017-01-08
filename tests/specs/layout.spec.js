/* global describe fdescribe xdescribe it fit xit
describeTable fdescribeTable xdescribeTable
entry fentry xentry
expect bracket
*/

describe('Layout', () => {
  it('should include master layout', () => {
    const template = bracket.compile(
      `---
master: tests/fixtures/master.brkt.html
---
[[## body1()
  tmpl-child
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-child');
  });

  it('should include master layout for 2 levels', () => {
    const template = bracket.compile(
      `---
master: tests/fixtures/master2.brkt.html
---
[[## body2()
  tmpl-child
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-master2 tmpl-child');
  });

  it('should support custom variable', () => {
    const template = bracket.compile(
      `---
master: tests/fixtures/master.brkt.html
test: test-val
test2: test2-val
---
[[## body1()
  tmpl-child [[= layout.test ]] [[= layout.test2 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-child test-val test2-val');
  });

  it('should support custom variable on master', () => {
    const template = bracket.compile(
      `---
master: tests/fixtures/master-var.brkt.html
test: test-val
test2: test2-val
---
[[## body1()
  tmpl-child
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-master test-val test2-val tmpl-child');
  });

  it('should support custom variable on master at 2 level', () => {
    const template = bracket.compile(
      `---
master: tests/fixtures/master2-var.brkt.html
test: test-val
---
[[## body2()
  tmpl-child [[= layout.test ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-master test-val master2-val tmpl-master2 test-val master2-val tmpl-child test-val');
  });

  it('should use the lowest declaration as the right one', () => {
    const template = bracket.compile(
      `---
master: tests/fixtures/master2-var.brkt.html
test: test-val
test2: test2-val
---
[[## body2()
  tmpl-child [[= layout.test ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-master test-val test2-val tmpl-master2 test-val test2-val tmpl-child test-val');
  });

  xit('should support changing to curly');
});
