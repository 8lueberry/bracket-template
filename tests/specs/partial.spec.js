/* global describe fdescribe xdescribe it fit xit expect bracket */

fdescribe('Partials', () => {
  it('should accept partials', () => {
    const template = bracket.compile(
      'tmpl-test [[# partial(\'../fixtures/partial.brkt.html\') ]]',
      {
        path: __dirname,
      },
    );
    const result = template();
    expect(result).toAlmostEqual('tmpl-test tmpl-partial');
  });

  xit('should detect circular deps');
  xit('should detect file not found');
});
