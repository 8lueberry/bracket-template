import fs from 'fs';

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

  has(filepath) {
    return this.readCache.has(filepath);
  }

  exist(filepath) {
    return this.has(filepath) || fs.existsSync(filepath);
  }
}

export default TemplateStore;
