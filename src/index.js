/* global window VERSION */

const settings = {
  log: false,

  // Extract anything inside [[ ]] to be evaluated as js
  evaluate: /\[\[([\s\S]+?(\}?)+)]]/g,

  // Extract anything in the form [[= model ]]
  interpolate: /\[\[=([\s\S]+?)]]/g,

  // Extract any block call [[# block1('arg') ]]
  block: /\[\[#\s*([\w]+)\(([\s\S]*?)\)\s*]]/g,

  // Extract any block definition [[## block1(arg) #]]
  blockDef: /\[\[##\s*([\w]+)\(([\s\w,]*)\)\s*[\n]([\s\S]*?)\n\s*#]]/g,

  // extract the argument values from a function call
  // e.g. { test1: '123', test2: 456, test3: true }, 'aaa', true, {}, ''
  argValues: /\s*({[\s\S]*?}|[^,]+)/g,

  // The params to pass to the template function
  // For multiple params, comma delimited e.g. 'model,model2,model3...'
  varname: 'model',
};

const logger = {
  context: (name) => {
    const result = {
      debug: (...args) => {
        if (settings.log) {
          console.log(name, ': ', ...args);
        }
      },
    };
    return result;
  },
};

function compile(tmpl, conf) {
  let str = tmpl || '';
  const c = Object.assign({}, settings, conf);
  const blocks = {};

  str = str
    // handle section def
    .replace(c.blockDef, (m, name, args, body) => {
      const log = logger.context('block.def');
      log.debug(`${name} accepting ${args}`);

      blocks[name] = {
        args: args.split(',').map(a => a.trim()),
        body,
      };
      return '';
    })

    // handle section call
    .replace(c.block, (m, name, args) => {
      const log = logger.context('block.call');

      if (!blocks[name]) {
        log.debug('Block doesn\'t exist');
        return '';
      }

      log.debug(`Calling ${name} with ${args}`);

      // arg -> value
      const argValues = [];
      args.replace(c.argValues, (m2, val) => {
        argValues.push(val);
      });
      const lookup = blocks[name].args.reduce((res, k, i) => {
        const hash = res;
        hash[k] = argValues.length <= i ? undefined : argValues[i];
        return hash;
      }, {});

      log.debug('Lookup args:', lookup);

      const blockStr = blocks[name].body.replace(c.interpolate, (m2, codeVal) => {
        const code = codeVal.trim();

        // support obj.arg
        const key = code.split('.')[0];
        if (!(key in lookup)) {
          return m2;
        }

        // Generate the value by making a scoped function
        // e.g. function() { var arg = { test1: '123' }; return arg.test1; }
        const valStr = `var ${key}=${lookup[key]};return ${code};`;
        log.debug(`Arg retrieval for ${code} (${key}) -> ${valStr}`);
        const val = Function(valStr)(); // eslint-disable-line

        return `';out+=${JSON.stringify(val)};out+='`;
      });

      log.debug('Replaced:', blockStr);
      return blockStr;
    })

    // convert models
    .replace(c.interpolate, (m, code) => `';out+=${code.trim()};out+='`)

    // raw js
    .replace(c.evaluate, (m, code) => `';${code.trim()}out+='`);

  // build the template function body
  str = `var out='${str}';return out;`
    // remove the newlines or '' will break
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1')
    .replace(/\+''/g, '');

  logger.context('template').debug('Generated template function:', str);
  return new Function(c.varname, str); // eslint-disable-line
}

const res = {
  version: typeof VERSION === 'undefined' ? 'test' : VERSION, // read from package.json
  logger,
  settings,
  compile,
};

// browser
const isBrowser = (typeof window !== 'undefined');

if (isBrowser) {
  logger.context('global').debug('Browser context, adding to window.bracket');
  window.bracket = res;
} else {
  logger.context('global').debug('Node context');
}

export default res;
