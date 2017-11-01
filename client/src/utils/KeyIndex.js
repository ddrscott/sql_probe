// TODO: Noone appears to be using this, remove this?
export default class KeyIndexer {
  constructor() {
    this.map = new Map();
  }

  getIndex(key) {
    const { map } = this;
    let index = map.get(key);
    if (index === undefined) {
      index = map.size;
      map.set(key, index);
    }
    return index;
  }
}
