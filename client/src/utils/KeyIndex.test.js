import KeyIndex from './KeyIndex';

describe('KeyIndexer(key:any)', () => {
  it('does stuff', () => {
    const ki = new KeyIndex();
    expect(ki.getIndex('one')).toBe(1);
    expect(ki.getIndex('two')).toBe(2);

    expect(ki.getIndex('one')).toBe(1);
    expect(ki.getIndex('two')).toBe(2);

    expect(ki.getIndex('three')).toBe(3);
  })
})
