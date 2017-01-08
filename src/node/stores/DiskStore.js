import fs from 'fs';

export default class DiskStore {
  /**
   * Gets the file (from cache or file)
   */
  get(filepath) {
    const raw = fs.readFileSync(filepath, 'utf8');
    const clean = raw.replace(/^\uFEFF/, '');

    return clean;
  }

  /**
   * Checks if a file exists
   */
  exist(filepath) {
    return fs.existsSync(filepath);
  }
}
