/* global describe fdescribe xdescribe it fit xit
describeTable fdescribeTable xdescribeTable
entry fentry xentry
expect bracket
*/

describe('Consolidate', () => {
  it('Pass the consolidate test', () => {
    const template = bracket.compile('<p>[[= model.user.name ]]</p>');
    const result = template({ user: { name: 'Tobi' } });
    expect(result).toEqual('<p>Tobi</p>');
  });
});
