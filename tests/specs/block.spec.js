/* global describe fdescribe xdescribe it fit xit
describeTable fdescribeTable xdescribeTable
entry fentry xentry
expect bracket
*/

describe('Blocks', () => {
  it('should support empty argument', () => {
    const template = bracket.compile(`tmpl-[[# block1() ]]
[[## block1()
test
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test');
  });

  it('should support block argument', () => {
    const template = bracket.compile(`tmpl-[[# block1('aaa', 'bbb') ]]
[[## block1(arg1, arg2)
test-[[= arg1 ]]-[[= arg2 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa-bbb');
  });

  describeTable('should support simple arg',
    (arg, resultString) => {
      const template = bracket.compile(`tmpl-[[# block1(${arg}) ]]
[[## block1(arg)
test-[[= arg ]]
#]]`);
      const result = template();
      expect(result).toAlmostEqual(resultString);
    },
    entry('should support string', '\'aaa\'', 'tmpl-test-aaa'),
    entry('should support null', 'null', 'tmpl-test-null'),
    entry('should support undefined', 'undefined', 'tmpl-test-undefined'),
    entry('should support undefined (implicit)', '', 'tmpl-test-undefined'),
    entry('should support numbers', '123', 'tmpl-test-123'),
    entry('should support boolean', 'true', 'tmpl-test-true') // eslint-disable-line
  );

  it('should support undefined (implicit as second arg)', () => {
    const template = bracket.compile(`tmpl-[[# block1('aaa') ]]
[[## block1(arg1, arg2)
test-[[= arg1 ]]-[[= arg2 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa-undefined');
  });

  it('should support complex object', () => {
    const template = bracket.compile(`tmpl-[[# block1({ test1: 'aaa', test2: 456, test3: true }) ]]
[[## block1(arg)
test-[[= arg.test1 ]]-[[= arg.test2 ]]-[[= arg.test3 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa-456-true');
  });

  it('should support complex combitations of var', () => {
    const template = bracket.compile(
      `tmpl-[[# block1({ test1: 'aaa', test2: 123 }, true, 456, { test1: 'bbb', test2: 789 }) ]]
[[## block1(arg1, arg2, arg3, arg4)
test-[[= arg1.test1 ]]-[[= arg1.test2 ]]-[[= arg2 ]]-[[= arg3 ]]-[[= arg4.test1 ]]-[[= arg4.test2 ]]
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-test-aaa-123-true-456-bbb-789');
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
    expect(result).toAlmostEqual('tmpl-test1-test1-test2-test2');
  });

  it('should support calling blocks in blocks', () => {
    const template = bracket.compile(
      `tmpl-[[# block1() ]]
[[## block1()
block1-[[# block2() ]]
#]][[## block2()
block2
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-block1-block2');
  });

  describeTable('should support special characters in body',
    (arg, resultString) => {
      const template = bracket.compile(`tmpl-[[# block1() ]]
[[## block1()
${arg}
#]]`);
      const result = template();
      expect(result).toAlmostEqual(resultString);
    },
    entry('should support \'', '\'test\'', 'tmpl-\'test\''),
    entry('should support "', '"test"', 'tmpl-"test"') // eslint-disable-line
  );

  describeTable('should support special characters arg',
    (arg, resultString) => {
      const template = bracket.compile(`tmpl-[[# block1() ]]
[[## block1()
block1-[[# block2(${arg}) ]]
#]][[## block2(arg1)
block2-[[= arg1 ]]
#]]`);
      const result = template();
      expect(result).toAlmostEqual(resultString);
    },
    entry('should support \'', '\'test\'', 'tmpl-block1-block2-test'),
    entry('should support "', '"test"', 'tmpl-block1-block2-test') // eslint-disable-line
  );

  it('should support empty block', () => {
    const template = bracket.compile(`tmpl-[[# block1() ]]
[[## block1()
#]]`);
    const result = template();
    expect(result).toAlmostEqual('tmpl-');
  });

  xit('should support arg with ,');
  xit('should support arg object with }');
});
