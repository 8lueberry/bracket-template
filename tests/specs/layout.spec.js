/* global describe fdescribe it fit expect bracket */

fdescribe('Layout', () => {
  it('should include master layout', () => {
    const template = bracket.compile(`---
    layout: ../fixtures/master.dot
    ---
    tmpl-child
    `);
    const result = template();
    expect(result).toEqual('tmpl-master tmpl-child');
  });
});
