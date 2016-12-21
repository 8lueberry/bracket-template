/* global describe fdescribe xdescribe it fit xit
describeTable fdescribeTable xdescribeTable
entry fentry xentry
expect bracket
*/

describe('Layout', () => {
  it('should include master layout', () => {
    const template = bracket.compile(
      `---
  master: ../fixtures/master.brkt.html
---
    tmpl-child`,
      {
        path: __dirname,
      },
    );
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-child');
  });
});
