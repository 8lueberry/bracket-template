/*
 * Bracket template library
 *
 */

/* global window VERSION */

const settings = {
  // Extract anything inside [[ ]] to be evaluated as js
  evaluate: /\[\[([\s\S]+?(\}?)+)]]/g,

  // Extract anything in the form [[= model ]]
  interpolate: /\[\[=([\s\S]+?)]]/g,

  // Extract any block call [[# block1('arg') ]]
  block: /\[\[#\s*([\w]+)\(([\s\S]*?)\)\s*]]/g,

  // Extract any block definition [[## block1(arg) #]]
  blockDef: /\[\[##\s*([\w]+)\(([\s\w,]*)\)\s*[\n]([\s\S]*?)\s*#]]/g,

  // extract the argument values from a function call
  // e.g. { test1: '123', test2: 456, test3: true }, 'aaa', true, {}, ''
  argValues: /\s*({[\s\S]*?}|[^,]+)/g, // TODO: bug with , and }

  // The params to pass to the template function
  // For multiple params, comma delimited e.g. 'model,model2,model3...'
  varname: 'model',

  // helper functions
  helpers: {},
};

function handleBlockCall(c, blocks) {
  return (m, name, argStr) => {
    // no block definition
    if (!c.helpers[name] && !blocks[name]) {
      return '';
    }

    // split arg string
    const args = [];
    argStr.replace(c.argValues, (m2, val) => {
      args.push(val);
    });

    // call helpers
    if (c.helpers[name]) {
      const val = c.helpers[name](...args.map(a => Function(`return ${jsValue(a)};`)())); // eslint-disable-line
      return `';out+=${JSON.stringify(val)};out+='`;
    }

    // call block def

    // maps arg name and value
    const lookup = blocks[name].args.reduce((res, k, i) => {
      const hash = res;
      hash[k] = args.length <= i ? undefined : jsValue(args[i]); // fix the replacement of ' to \'
      return hash;
    }, {});

    const blockStr = blocks[name].body
      // replace block def with arg values
      .replace(c.interpolate, (m2, codeVal) => {
        const code = codeVal.trim();

        // support obj.arg
        const key = code.split('.')[0];

        // key not found then leave it as is
        if (!(key in lookup)) {
          return m2;
        }

        // Generate the value by making a scoped function
        // e.g. function() { var arg = { test1: '123' }; return arg.test1; }
        const valStr = `var ${key}=${lookup[key]};return ${code};`;
        const val = Function(valStr)(); // eslint-disable-line

        return `';out+=${JSON.stringify(val)};out+='`;
      })
      // recursive handle block call
      .replace(c.block, handleBlockCall(c, blocks));

    return blockStr;
  };
}

/**
 * Compile creates a template function
 * @param {string} tmpl - The html template to compile
 * @param {object} conf - The configuration to override
 * @return {function} The template function
 */
function compile(tmpl, conf) {
  let str = tmpl || '';
  const c = Object.assign({}, settings, conf);
  const blocks = {};

  str = str
    // allow the use of ' in the body
    .replace(/'/g, '\\\'')

    // handle block def
    .replace(c.blockDef, (m, name, argStr, body) => {
      blocks[name] = {
        args: argStr.split(',').map(a => a.trim()),
        body,
      };
      return '';
    })

    // handle block call
    .replace(c.block, handleBlockCall(c, blocks))

    // convert models
    .replace(c.interpolate, (m, code) => `';out+=${jsValue(code)};out+='`)

    // raw js
    .replace(c.evaluate, (m, code) => `';${jsValue(code)}out+='`);

  // build the template function body
  str = `var out='${str}';return out;`
    // remove the newlines or '' will break
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1')
    .replace(/\+''/g, '');

  return new Function(c.varname, str); // eslint-disable-line
}

/**
 * Helper for JS value
 */
function jsValue(val) {
  return val
    .trim()
    .replace(/\\'/g, '\''); // fix the replacement of ' to \'
}

// The object to export
const res = {
  version: typeof VERSION === 'undefined' ? 'test' : VERSION, // read from package.json
  settings,
  compile,
};

// browser: add to window.bracket
if (typeof window !== 'undefined') {
  window.bracket = res;
}

export default res;
