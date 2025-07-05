class LRUCache {
  constructor() {
    this.get = jest.fn();
    this.set = jest.fn();
    this.has = jest.fn();
    this.delete = jest.fn();
    this.clear = jest.fn();
  }
}
module.exports = LRUCache;
module.exports.default = LRUCache;
module.exports.LRUCache = LRUCache;
export default LRUCache;
export { LRUCache };
