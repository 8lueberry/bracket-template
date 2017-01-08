import bracket from '../bracket';
import CacheStore from './stores/CacheStore';
import DiskStore from './stores/DiskStore';

const cacheStore = new CacheStore();
const diskStore = new DiskStore();

export default class LayoutHelper {
  constructor() {
    this.store = cacheStore;
  }

  /**
   * Renders a partial file
   */
  partial(filepath, partialModel) {
    const tmpl = this.store.get(filepath);
    const template = bracket.compile(tmpl);
    const result = template(partialModel);
    return result;
  }

  /**
   * Enables or disables the cache
   */
  enableCache(enable) {
    this.store = enable ? cacheStore : diskStore;
  }
}
