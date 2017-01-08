import path from 'path';
import yaml from 'js-yaml';

import LayoutHelper from './LayoutHelper';
import LayoutDependency from './LayoutDependency';
import TemplateStore from './TemplateStore';

// map for caching dependency files (raw file)
const layoutHelper = new LayoutHelper({
  store: new TemplateStore(),
});

// default helpers
const helpers = {
  partial: (...args) => layoutHelper.partial(...args),
};

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

class LayoutTemplate {
  constructor(opts = {
    conf: {},
    tmpl: '',
  }) {
    // TODO: assert opts.conf
    this.conf = opts.conf;

    // TODO: should be done in LayoutTemplate
    if (this.conf.filename) {
      this.conf.filepath = path.dirname(this.conf.filename);
    }

    const { header, deps, tmpl } = parseTemplate(this.conf, opts.tmpl);
    this.header = header;
    this.tmpl = tmpl;
    this.deps = deps;

    // add helper data (partials, variables from child)
    this.conf.helpers = Object.assign(
      {},
      helpers,
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

export default LayoutTemplate;
