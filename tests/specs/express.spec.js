/* global describe fdescribe xdescribe it fit xit
describeTable fdescribeTable xdescribeTable
entry fentry xentry
expect bracket
*/

import path from 'path';

describe('Express', () => {
  it('should resolve from filename', () => {
    const template = bracket.compile(
      `---
master: ../fixtures/master.brkt.html
---
[[## body1()
  tmpl-child
#]]`,
      {
        filename: __filename,
      },
    );
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-child');
  });

  it('should resolve master from filename', () => {
    const template = bracket.compile(
      `---
master: ../fixtures/master2.brkt.html
---
[[## body2()
  tmpl-child
#]]`,
      {
        filename: __filename,
      });
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-master2 tmpl-child');
  });

  it('should support reading from views (single path)', () => {
    const template = bracket.compile(
      `---
master: master.brkt.html
---
[[## body1()
  tmpl-child
#]]`,
      {
        filename: __filename,
        settings: {
          views: path.resolve(__dirname, '../fixtures'),
        },
      },
    );
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-child');
  });

  it('should support reading from views (array path)', () => {
    const template = bracket.compile(
      `---
master: master.brkt.html
---
[[## body1()
  tmpl-child
#]]`,
      {
        filename: __filename,
        settings: {
          views: [path.resolve(__dirname, '../fake'), path.resolve(__dirname, '../fixtures')],
        },
      },
    );
    const result = template();
    expect(result).toAlmostEqual('tmpl-master tmpl-child');
  });
});
