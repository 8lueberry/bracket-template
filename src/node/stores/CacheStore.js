import DiskStore from './DiskStore';

export default class CacheStore {
  constructor() {
    this.diskStore = new DiskStore();
    this.readCache = new Map();
  }

  /**
   * Gets the file (from cache or file)
   */
  get(filepath) {
    const fromCache = this.readCache.get(filepath);
    if (fromCache) {
      return fromCache;
    }

    const file = this.diskStore.get(filepath);
    this.readCache.set(filepath, file);

    return file;
  }

  /**
   * Checks if a file exists
   */
  exist(filepath) {
    return this.readCache.has(filepath) || this.diskStore.exist(filepath);
  }
}
