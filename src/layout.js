/* Layout support - node only */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import bracket from './bracket';

/**
* Engine settings
*/
const settings = {

  // layout config
  header: /^---([\s\S]+?)---/g,

  // comments
  comment: /<!--([\s\S]+?)-->/g,

  // partials
  partial: /##/g,

  // header keys
  keys: {
    master: 'master',
  },
};

// map for caching master files
const readCache = new Map();

class LayoutDependency {
  constructor() {
    this.master = null;
    this.partials = [];
  }

  /**
   * Checks whether it has a circular dependency
   */
  hasCircular() {
    return false;
  }

  /**
   * Retrieves the list of paths
   */
  getPaths() {
    // this.master.path
    return this.partials.map(p => p.path);
  }
}

class LayoutTemplate {
  constructor(opts = {
    conf: settings,
    tmpl: '',
  }) {
    this.conf = opts.conf;

    const { header, deps, tmpl } = this.parseTemplate(opts.tmpl);
    this.header = header;
    this.tmpl = tmpl;
    this.deps = deps;
  }

  /**
   * Parses the template
   */
  parseTemplate(tmpl) {
    // header
    let header;
    const cleanTmpl = tmpl.replace(this.conf.header, (m, headerStr) => {
      header = yaml.safeLoad(headerStr);
      return '';
    });

    // dependencies
    const deps = new LayoutDependency();

    const masterPath = this.header[this.conf.keys.master];
    if (masterPath) {
      deps.master = {
        path: this.header[this.conf.keys.master],
      };
    }

    tmpl.replace(this.conf.partial, (m, partial) => {
      deps.partials.append({
        path: partial,
      });
    });

    return {
      header,
      deps,
      tmpl: cleanTmpl,
    };
  }

  render() {
    // TODO: check circular
    if (this.hasMaster) {
      const masterLayoutTemplate = this.getMasterLayoutTemplate();
      return masterLayoutTemplate.render();
    }

    return this.tmpl;
  }
}

/**
 * This callback is displayed as a global member.
 * @callback readCallback
 * @param {object} err - Any error
 * @param {string} content - The file content
 */

/**
 * Reads a file asynchronously
 * @param {string} filepath - The filepath
 * @param {readCallback} cb - The callback
 */
function read(filepath, cb) {
  const str = readCache.get(path);

  // cached (only if cached is a string and not a compiled template function)
  if (str) {
    return cb(null, str);
  }

  // read
  fs.readFile(path, 'utf8', (err, raw) => {
    if (err) {
      return cb(err);
    }

    // remove extraneous utf8 BOM marker
    const clean = raw.replace(/^\uFEFF/, '');
    readCache.set(path, clean);

    cb(null, clean);
    return undefined;
  });
}

/**
 * Compile creates a template function
 * @param {string} tmpl - The html template to compile
 * @param {object} conf - The configuration to override
 * @return {function} The template function
 */
function compile(tmpl, conf) {
  const c = Object.assign({}, settings, conf);

  const template = new LayoutTemplate({
    conf: c,
    tmpl,
  });

  console.log(`\r\n\r\nAAAAAA\r\n${template.toString()}\r\n\r\n`);
  return bracket.compile('aaa', conf);
}

const res = Object.assign(
  {},
  bracket,
  {
    compile,
  },
);

export default res;
