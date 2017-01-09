/* Layout support - node only */

import bracket from './bracket';
import LayoutTemplate from './node/LayoutTemplate';

/**
* Engine settings
*/
const settings = {

  // layout config
  header: /^---([\s\S]+?)---/g,

  // comments
  comment: /<!--([\s\S]+?)-->/g,

  // partials
  partial: /\[\[#\s*partial\(['"]([\S]*)['"]([\s\S]*?)\)\s*]]/g,

  // header keys
  keys: {
    master: 'master', // header master key
    layout: 'layout', // header ref name
  },

  // filepath
  filepath: process.cwd(),

  // helper methods
  helpers: {},
};

/**
 * Compile creates a template function
 * @param {string} tmpl - The html template to compile
 * @param {object} conf - The configuration to override
 * @return {function} The template function
 */
function compile(tmpl, conf) {
  const c = Object.assign(
    {},
    settings,
    conf,
  );

  const template = new LayoutTemplate({
    conf: c,
    tmpl,
  });

  return bracket.compile(
    template.compile(),
    template.conf,
  );
}

const res = Object.assign(
  {},
  bracket,
  {
    compile,
  },
);

export default res;
