import * as fs from 'fs';

class TemplateStore {
  constructor() {
    this.readCache = new Map();
  }

  get(filepath) {
    const fromCache = this.readCache.get(filepath);
    if (fromCache) {
      return fromCache;
    }

    const raw = fs.readFileSync(filepath, 'utf8');
    const clean = raw.replace(/^\uFEFF/, '');
    this.readCache.set(filepath, clean);

    return clean;
  }
}

export default TemplateStore;
