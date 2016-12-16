/* global describe fdescribe xdescribe it fit xit expect bracket */

describe('Blocks', () => {
  it('should support empty argument', () => {
    const template = bracket.compile(`tmpl-[[# block1() ]]
[[## block1()
test
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test\n');
  });

  it('should support block argument', () => {
    const template = bracket.compile(`tmpl-[[# block1('aaa', 'bbb') ]]
[[## block1(arg1, arg2)
test-[[= arg1 ]]-[[= arg2 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa-bbb\n');
  });

  it('should support strings', () => {
    const template = bracket.compile(`tmpl-[[# block1('aaa') ]]
[[## block1(arg)
test-[[= arg ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa\n');
  });

  it('should support null', () => {
    const template = bracket.compile(`tmpl-[[# block1(null) ]]
[[## block1(arg)
test-[[= arg ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-null\n');
  });

  it('should support undefined', () => {
    const template = bracket.compile(`tmpl-[[# block1(undefined) ]]
[[## block1(arg)
test-[[= arg ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-undefined\n');
  });

  it('should support undefined (implicit)', () => {
    const template = bracket.compile(`tmpl-[[# block1() ]]
[[## block1(arg)
test-[[= arg ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-undefined\n');
  });

  it('should support undefined (implicit as second arg)', () => {
    const template = bracket.compile(`tmpl-[[# block1('aaa') ]]
[[## block1(arg1, arg2)
test-[[= arg1 ]]-[[= arg2 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa-undefined\n');
  });

  it('should support numbers', () => {
    const template = bracket.compile(`tmpl-[[# block1(123) ]]
[[## block1(arg)
test-[[= arg ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-123\n');
  });

  it('should support boolean', () => {
    const template = bracket.compile(`tmpl-[[# block1(true) ]]
[[## block1(arg)
test-[[= arg ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-true\n');
  });

  it('should support complex object', () => {
    const template = bracket.compile(`tmpl-[[# block1({ test1: 'aaa', test2: 456, test3: true }) ]]
[[## block1(arg)
test-[[= arg.test1 ]]-[[= arg.test2 ]]-[[= arg.test3 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa-456-true\n');
  });

  it('should support complex combitations of var', () => {
    const template = bracket.compile(
      `tmpl-[[# block1({ test1: 'aaa', test2: 123 }, true, 456, { test1: 'bbb', test2: 789 }) ]]
[[## block1(arg1, arg2, arg3, arg4)
test-[[= arg1.test1 ]]-[[= arg1.test2 ]]-[[= arg2 ]]-[[= arg3 ]]-[[= arg4.test1 ]]-[[= arg4.test2 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa-123-true-456-bbb-789\n');
  });

  it('should support multiple blocks', () => {
    const template = bracket.compile(
      `tmpl-[[# block1('test1') ]]-[[# block2('test2') ]]
[[## block1(arg)
test1-[[= arg ]]
#]][[## block2(arg)
test2-[[= arg ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test1-test1-test2-test2\n');
  });
});
