import path from 'path';
import yaml from 'js-yaml';

import LayoutHelper from './LayoutHelper';
import LayoutDependency from './LayoutDependency';

// helper for layout (partial, store...)
const layoutHelper = new LayoutHelper();

export default class LayoutTemplate {
  constructor(opts = {
    conf: {},
    tmpl: '',
  }) {
    this.conf = initConfig(opts.conf);

    layoutHelper.enableCache(!this.conf.settings || !!this.conf.settings['view cache']);

    const { header, deps, tmpl } = parseTemplate(this.conf, opts.tmpl);
    this.header = header;
    this.tmpl = tmpl;
    this.deps = deps;

    // add helper data (partials, variables from child)
    this.conf.helpers = Object.assign(
      {
        partial: (...args) => layoutHelper.partial(...args),
      },
      opts.conf.helpers,
    );
  }

  compile(header = {}) {
    if (this.deps.hasCircular()) {
      throw new Error('Has circular dependencies');
    }

    if (!this.deps.hasMaster()) {
      // header support
      let layout = '';
      Object
        .keys(header)
        .filter(key => key !== 'master')
        .forEach((key) => {
          layout += `${this.conf.keys.layout}.${key}=${JSON.stringify(header[key])};`;
        });
      layout = layout ? `[[ var ${this.conf.keys.layout}={};${layout} ]] ` : '';

      return `${layout}${this.tmpl}`;
    }

    const masterLayoutTemplate = new LayoutTemplate({
      conf: Object.assign(
        {},
        this.conf,
        {
          filename: this.deps.master.path,
        },
      ),
      tmpl: layoutHelper.store.get(this.deps.master.path),
    });

    const newHeader = Object.assign(
      {},
      this.header,
      header,
    );

    return `${this.tmpl} ${masterLayoutTemplate.compile(newHeader)}`;
  }

  toString() {
    return `LayoutTemplate:
  master: ${this.deps.master ? this.deps.master.path : 'none'}
  partials: ${this.deps.partials.map(d => d.path)}
    `;
  }
}

/**
 * Initialize the config
 * @param {object} conf - The configuration
 */
function initConfig(conf) {
  const result = Object.assign({}, conf);
  if (conf.filename) {
    result.filepath = path.dirname(conf.filename);
  }
  return result;
}

/**
 * Parses the template looking for file dependencies (but doesn't load the dependency files).
 * @param {object} conf - The configuration
 * @param {string} tmpl - The template string to parse
 */
function parseTemplate(conf, tmpl) {
  // header
  let header = {};
  let cleanTmpl = tmpl.replace(conf.header, (m, headerStr) => {
    header = yaml.safeLoad(headerStr);
    return '';
  });

  // dependencies
  const deps = new LayoutDependency();

  const masterPath = header[conf.keys.master];
  if (masterPath) {
    deps.master = {
      path: lookupFile(conf, header[conf.keys.master]),
    };
  }

  // replace partial call's relative path to full path
  cleanTmpl = cleanTmpl.replace(conf.partial, (m, partialPath) => {
    const fullPath = lookupFile(conf, partialPath);
    deps.partials.set(
      partialPath,
      {
        path: fullPath,
      },
    );
    return m.replace(partialPath, fullPath);
  });

  return {
    header,
    deps,
    tmpl: cleanTmpl,
  };
}

/**
 * Lookup files for express from
 *  - relative to current file
 *  - relative to views
 * @param {object} conf - The configuration
 * @param {string} fileRelative - The relative path of the file
 */
function lookupFile(conf, fileRelative) {
  const relativeToFile = path.resolve(conf.filepath, fileRelative);
  if (layoutHelper.store.exist(relativeToFile)) {
    return relativeToFile;
  }

  if (conf.settings && conf.settings.views) {
    if (!Array.isArray(conf.settings.views)) {
      const fromView = path.resolve(conf.settings.views, fileRelative);
      if (layoutHelper.store.exist(fromView)) {
        return fromView;
      }
    }

    for (let i = 0; i < conf.settings.views.length; i += 1) {
      const fromView = path.resolve(conf.settings.views[i], fileRelative);
      if (layoutHelper.store.exist(fromView)) {
        return fromView;
      }
    }
  }

  return relativeToFile;
}
