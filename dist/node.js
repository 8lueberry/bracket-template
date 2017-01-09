(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("path"), (function webpackLoadOptionalExternalModule() { try { return require("buffer"); } catch(e) {} }()), require("fs"));
	else if(typeof define === 'function' && define.amd)
		define(["path", "buffer", "fs"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("path"), (function webpackLoadOptionalExternalModule() { try { return require("buffer"); } catch(e) {} }()), require("fs")) : factory(root["path"], root["buffer"], root["fs"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_26__, __WEBPACK_EXTERNAL_MODULE_39__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _bracket = __webpack_require__(1);

	var _bracket2 = _interopRequireDefault(_bracket);

	var _LayoutTemplate = __webpack_require__(2);

	var _LayoutTemplate2 = _interopRequireDefault(_LayoutTemplate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	* Engine settings
	*/
	/* Layout support - node only */

	var settings = {

	  // layout config
	  header: /^---([\s\S]+?)---/g,

	  // comments
	  comment: /<!--([\s\S]+?)-->/g,

	  // partials
	  partial: /\[\[#\s*partial\(['"]([\S]*)['"]([\s\S]*?)\)\s*]]/g,

	  // header keys
	  keys: {
	    master: 'master', // header master key
	    layout: 'layout' },

	  // filepath
	  filepath: process.cwd(),

	  // helper methods
	  helpers: {}
	};

	/**
	 * Compile creates a template function
	 * @param {string} tmpl - The html template to compile
	 * @param {object} conf - The configuration to override
	 * @return {function} The template function
	 */
	function compile(tmpl, conf) {
	  var c = Object.assign({}, settings, conf);

	  var template = new _LayoutTemplate2.default({
	    conf: c,
	    tmpl: tmpl
	  });

	  return _bracket2.default.compile(template.compile(), template.conf);
	}

	var res = Object.assign({}, _bracket2.default, {
	  compile: compile
	});

	exports.default = res;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/*
	 * Bracket template library
	 *
	 */

	/* global window VERSION */

	var settings = {
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
	  helpers: {}
	};

	function handleBlockCall(c, blocks) {
	  return function (m, name, argStr) {
	    // no block definition
	    if (!c.helpers[name] && !blocks[name]) {
	      return '';
	    }

	    // split arg string
	    var args = [];
	    argStr.replace(c.argValues, function (m2, val) {
	      args.push(val);
	    });

	    // call helpers
	    if (c.helpers[name]) {
	      var _c$helpers;

	      var val = (_c$helpers = c.helpers)[name].apply(_c$helpers, _toConsumableArray(args.map(function (a) {
	        return Function('return ' + jsValue(a) + ';')();
	      }))); // eslint-disable-line
	      return '\';out+=' + JSON.stringify(val) + ';out+=\'';
	    }

	    // call block def

	    // maps arg name and value
	    var lookup = blocks[name].args.reduce(function (res, k, i) {
	      var hash = res;
	      hash[k] = args.length <= i ? undefined : jsValue(args[i]); // fix the replacement of ' to \'
	      return hash;
	    }, {});

	    var blockStr = blocks[name].body
	    // replace block def with arg values
	    .replace(c.interpolate, function (m2, codeVal) {
	      var code = codeVal.trim();

	      // support obj.arg
	      var key = code.split('.')[0];

	      // key not found then leave it as is
	      if (!(key in lookup)) {
	        return m2;
	      }

	      // Generate the value by making a scoped function
	      // e.g. function() { var arg = { test1: '123' }; return arg.test1; }
	      var valStr = 'var ' + key + '=' + lookup[key] + ';return ' + code + ';';
	      var val = Function(valStr)(); // eslint-disable-line

	      return '\';out+=' + JSON.stringify(val) + ';out+=\'';
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
	  var str = tmpl || '';
	  var c = Object.assign({}, settings, conf);
	  var blocks = {};

	  str = str
	  // allow the use of ' in the body
	  .replace(/'/g, '\\\'')

	  // handle block def
	  .replace(c.blockDef, function (m, name, argStr, body) {
	    blocks[name] = {
	      args: argStr.split(',').map(function (a) {
	        return a.trim();
	      }),
	      body: body
	    };
	    return '';
	  })

	  // handle block call
	  .replace(c.block, handleBlockCall(c, blocks))

	  // convert models
	  .replace(c.interpolate, function (m, code) {
	    return '\';out+=' + jsValue(code) + ';out+=\'';
	  })

	  // raw js
	  .replace(c.evaluate, function (m, code) {
	    return '\';' + jsValue(code) + 'out+=\'';
	  });

	  // build the template function body
	  str = ('var out=\'' + str + '\';return out;'
	  // remove the newlines or '' will break
	  ).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '');

	  return new Function(c.varname, str); // eslint-disable-line
	}

	/**
	 * Helper for JS value
	 */
	function jsValue(val) {
	  return val.trim().replace(/\\'/g, '\''); // fix the replacement of ' to \'
	}

	// The object to export
	var res = {
	  version:  false ? 'test' : ("1.1.5"), // read from package.json
	  settings: settings,
	  compile: compile
	};

	// browser: add to window.bracket
	if (typeof window !== 'undefined') {
	  window.bracket = res;
	}

	exports.default = res;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _jsYaml = __webpack_require__(4);

	var _jsYaml2 = _interopRequireDefault(_jsYaml);

	var _LayoutHelper = __webpack_require__(36);

	var _LayoutHelper2 = _interopRequireDefault(_LayoutHelper);

	var _LayoutDependency = __webpack_require__(40);

	var _LayoutDependency2 = _interopRequireDefault(_LayoutDependency);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// helper for layout (partial, store...)
	var layoutHelper = new _LayoutHelper2.default();

	var LayoutTemplate = function () {
	  function LayoutTemplate() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
	      conf: {},
	      tmpl: ''
	    };

	    _classCallCheck(this, LayoutTemplate);

	    this.conf = initConfig(opts.conf);

	    layoutHelper.enableCache(!this.conf.settings || !!this.conf.settings['view cache']);

	    var _parseTemplate = parseTemplate(this.conf, opts.tmpl),
	        header = _parseTemplate.header,
	        deps = _parseTemplate.deps,
	        tmpl = _parseTemplate.tmpl;

	    this.header = header;
	    this.tmpl = tmpl;
	    this.deps = deps;

	    // add helper data (partials, variables from child)
	    this.conf.helpers = Object.assign({
	      partial: function partial() {
	        return layoutHelper.partial.apply(layoutHelper, arguments);
	      }
	    }, opts.conf.helpers);
	  }

	  _createClass(LayoutTemplate, [{
	    key: 'compile',
	    value: function compile() {
	      var _this = this;

	      var header = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      if (this.deps.hasCircular()) {
	        throw new Error('Has circular dependencies');
	      }

	      if (!this.deps.hasMaster()) {
	        // header support
	        var layout = '';
	        Object.keys(header).filter(function (key) {
	          return key !== 'master';
	        }).forEach(function (key) {
	          layout += _this.conf.keys.layout + '.' + key + '=' + JSON.stringify(header[key]) + ';';
	        });
	        layout = layout ? '[[ var ' + this.conf.keys.layout + '={};' + layout + ' ]] ' : '';

	        return '' + layout + this.tmpl;
	      }

	      var masterLayoutTemplate = new LayoutTemplate({
	        conf: Object.assign({}, this.conf, {
	          filename: this.deps.master.path
	        }),
	        tmpl: layoutHelper.store.get(this.deps.master.path)
	      });

	      var newHeader = Object.assign({}, this.header, header);

	      return this.tmpl + ' ' + masterLayoutTemplate.compile(newHeader);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return 'LayoutTemplate:\n  master: ' + (this.deps.master ? this.deps.master.path : 'none') + '\n  partials: ' + this.deps.partials.map(function (d) {
	        return d.path;
	      }) + '\n    ';
	    }
	  }]);

	  return LayoutTemplate;
	}();

	/**
	 * Initialize the config
	 * @param {object} conf - The configuration
	 */


	exports.default = LayoutTemplate;
	function initConfig(conf) {
	  var result = Object.assign({}, conf);
	  if (conf.filename) {
	    result.filepath = _path2.default.dirname(conf.filename);
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
	  var header = {};
	  var cleanTmpl = tmpl.replace(conf.header, function (m, headerStr) {
	    header = _jsYaml2.default.safeLoad(headerStr);
	    return '';
	  });

	  // dependencies
	  var deps = new _LayoutDependency2.default();

	  var masterPath = header[conf.keys.master];
	  if (masterPath) {
	    deps.master = {
	      path: lookupFile(conf, header[conf.keys.master])
	    };
	  }

	  // replace partial call's relative path to full path
	  cleanTmpl = cleanTmpl.replace(conf.partial, function (m, partialPath) {
	    var fullPath = lookupFile(conf, partialPath);
	    deps.partials.set(partialPath, {
	      path: fullPath
	    });
	    return m.replace(partialPath, fullPath);
	  });

	  return {
	    header: header,
	    deps: deps,
	    tmpl: cleanTmpl
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
	  var relativeToFile = _path2.default.resolve(conf.filepath, fileRelative);
	  if (layoutHelper.store.exist(relativeToFile)) {
	    return relativeToFile;
	  }

	  if (conf.settings && conf.settings.views) {
	    if (!Array.isArray(conf.settings.views)) {
	      var fromView = _path2.default.resolve(conf.settings.views, fileRelative);
	      if (layoutHelper.store.exist(fromView)) {
	        return fromView;
	      }
	    }

	    for (var i = 0; i < conf.settings.views.length; i += 1) {
	      var _fromView = _path2.default.resolve(conf.settings.views[i], fileRelative);
	      if (layoutHelper.store.exist(_fromView)) {
	        return _fromView;
	      }
	    }
	  }

	  return relativeToFile;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var yaml = __webpack_require__(5);

	module.exports = yaml;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var loader = __webpack_require__(6);
	var dumper = __webpack_require__(35);

	function deprecated(name) {
	  return function () {
	    throw new Error('Function ' + name + ' is deprecated and cannot be used.');
	  };
	}

	module.exports.Type = __webpack_require__(12);
	module.exports.Schema = __webpack_require__(11);
	module.exports.FAILSAFE_SCHEMA = __webpack_require__(15);
	module.exports.JSON_SCHEMA = __webpack_require__(14);
	module.exports.CORE_SCHEMA = __webpack_require__(13);
	module.exports.DEFAULT_SAFE_SCHEMA = __webpack_require__(10);
	module.exports.DEFAULT_FULL_SCHEMA = __webpack_require__(30);
	module.exports.load = loader.load;
	module.exports.loadAll = loader.loadAll;
	module.exports.safeLoad = loader.safeLoad;
	module.exports.safeLoadAll = loader.safeLoadAll;
	module.exports.dump = dumper.dump;
	module.exports.safeDump = dumper.safeDump;
	module.exports.YAMLException = __webpack_require__(8);

	// Deprecated schema names from JS-YAML 2.0.x
	module.exports.MINIMAL_SCHEMA = __webpack_require__(15);
	module.exports.SAFE_SCHEMA = __webpack_require__(10);
	module.exports.DEFAULT_SCHEMA = __webpack_require__(30);

	// Deprecated functions from JS-YAML 1.x.x
	module.exports.scan = deprecated('scan');
	module.exports.parse = deprecated('parse');
	module.exports.compose = deprecated('compose');
	module.exports.addConstructor = deprecated('addConstructor');

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*eslint-disable max-len,no-use-before-define*/

	var common = __webpack_require__(7);
	var YAMLException = __webpack_require__(8);
	var Mark = __webpack_require__(9);
	var DEFAULT_SAFE_SCHEMA = __webpack_require__(10);
	var DEFAULT_FULL_SCHEMA = __webpack_require__(30);

	var _hasOwnProperty = Object.prototype.hasOwnProperty;

	var CONTEXT_FLOW_IN = 1;
	var CONTEXT_FLOW_OUT = 2;
	var CONTEXT_BLOCK_IN = 3;
	var CONTEXT_BLOCK_OUT = 4;

	var CHOMPING_CLIP = 1;
	var CHOMPING_STRIP = 2;
	var CHOMPING_KEEP = 3;

	var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
	var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
	var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
	var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;

	function is_EOL(c) {
	  return c === 0x0A /* LF */ || c === 0x0D /* CR */;
	}

	function is_WHITE_SPACE(c) {
	  return c === 0x09 /* Tab */ || c === 0x20 /* Space */;
	}

	function is_WS_OR_EOL(c) {
	  return c === 0x09 /* Tab */ || c === 0x20 /* Space */ || c === 0x0A /* LF */ || c === 0x0D /* CR */;
	}

	function is_FLOW_INDICATOR(c) {
	  return c === 0x2C /* , */ || c === 0x5B /* [ */ || c === 0x5D /* ] */ || c === 0x7B /* { */ || c === 0x7D /* } */;
	}

	function fromHexCode(c) {
	  var lc;

	  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
	    return c - 0x30;
	  }

	  /*eslint-disable no-bitwise*/
	  lc = c | 0x20;

	  if (0x61 /* a */ <= lc && lc <= 0x66 /* f */) {
	    return lc - 0x61 + 10;
	  }

	  return -1;
	}

	function escapedHexLen(c) {
	  if (c === 0x78 /* x */) {
	      return 2;
	    }
	  if (c === 0x75 /* u */) {
	      return 4;
	    }
	  if (c === 0x55 /* U */) {
	      return 8;
	    }
	  return 0;
	}

	function fromDecimalCode(c) {
	  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
	    return c - 0x30;
	  }

	  return -1;
	}

	function simpleEscapeSequence(c) {
	  return c === 0x30 /* 0 */ ? '\x00' : c === 0x61 /* a */ ? '\x07' : c === 0x62 /* b */ ? '\x08' : c === 0x74 /* t */ ? '\x09' : c === 0x09 /* Tab */ ? '\x09' : c === 0x6E /* n */ ? '\x0A' : c === 0x76 /* v */ ? '\x0B' : c === 0x66 /* f */ ? '\x0C' : c === 0x72 /* r */ ? '\x0D' : c === 0x65 /* e */ ? '\x1B' : c === 0x20 /* Space */ ? ' ' : c === 0x22 /* " */ ? '\x22' : c === 0x2F /* / */ ? '/' : c === 0x5C /* \ */ ? '\x5C' : c === 0x4E /* N */ ? '\x85' : c === 0x5F /* _ */ ? '\xA0' : c === 0x4C /* L */ ? '\u2028' : c === 0x50 /* P */ ? '\u2029' : '';
	}

	function charFromCodepoint(c) {
	  if (c <= 0xFFFF) {
	    return String.fromCharCode(c);
	  }
	  // Encode UTF-16 surrogate pair
	  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
	  return String.fromCharCode((c - 0x010000 >> 10) + 0xD800, (c - 0x010000 & 0x03FF) + 0xDC00);
	}

	var simpleEscapeCheck = new Array(256); // integer, for fast access
	var simpleEscapeMap = new Array(256);
	for (var i = 0; i < 256; i++) {
	  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
	  simpleEscapeMap[i] = simpleEscapeSequence(i);
	}

	function State(input, options) {
	  this.input = input;

	  this.filename = options['filename'] || null;
	  this.schema = options['schema'] || DEFAULT_FULL_SCHEMA;
	  this.onWarning = options['onWarning'] || null;
	  this.legacy = options['legacy'] || false;
	  this.json = options['json'] || false;
	  this.listener = options['listener'] || null;

	  this.implicitTypes = this.schema.compiledImplicit;
	  this.typeMap = this.schema.compiledTypeMap;

	  this.length = input.length;
	  this.position = 0;
	  this.line = 0;
	  this.lineStart = 0;
	  this.lineIndent = 0;

	  this.documents = [];

	  /*
	  this.version;
	  this.checkLineBreaks;
	  this.tagMap;
	  this.anchorMap;
	  this.tag;
	  this.anchor;
	  this.kind;
	  this.result;*/
	}

	function generateError(state, message) {
	  return new YAMLException(message, new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart));
	}

	function throwError(state, message) {
	  throw generateError(state, message);
	}

	function throwWarning(state, message) {
	  if (state.onWarning) {
	    state.onWarning.call(null, generateError(state, message));
	  }
	}

	var directiveHandlers = {

	  YAML: function handleYamlDirective(state, name, args) {

	    var match, major, minor;

	    if (state.version !== null) {
	      throwError(state, 'duplication of %YAML directive');
	    }

	    if (args.length !== 1) {
	      throwError(state, 'YAML directive accepts exactly one argument');
	    }

	    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

	    if (match === null) {
	      throwError(state, 'ill-formed argument of the YAML directive');
	    }

	    major = parseInt(match[1], 10);
	    minor = parseInt(match[2], 10);

	    if (major !== 1) {
	      throwError(state, 'unacceptable YAML version of the document');
	    }

	    state.version = args[0];
	    state.checkLineBreaks = minor < 2;

	    if (minor !== 1 && minor !== 2) {
	      throwWarning(state, 'unsupported YAML version of the document');
	    }
	  },

	  TAG: function handleTagDirective(state, name, args) {

	    var handle, prefix;

	    if (args.length !== 2) {
	      throwError(state, 'TAG directive accepts exactly two arguments');
	    }

	    handle = args[0];
	    prefix = args[1];

	    if (!PATTERN_TAG_HANDLE.test(handle)) {
	      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
	    }

	    if (_hasOwnProperty.call(state.tagMap, handle)) {
	      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
	    }

	    if (!PATTERN_TAG_URI.test(prefix)) {
	      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
	    }

	    state.tagMap[handle] = prefix;
	  }
	};

	function captureSegment(state, start, end, checkJson) {
	  var _position, _length, _character, _result;

	  if (start < end) {
	    _result = state.input.slice(start, end);

	    if (checkJson) {
	      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
	        _character = _result.charCodeAt(_position);
	        if (!(_character === 0x09 || 0x20 <= _character && _character <= 0x10FFFF)) {
	          throwError(state, 'expected valid JSON character');
	        }
	      }
	    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
	      throwError(state, 'the stream contains non-printable characters');
	    }

	    state.result += _result;
	  }
	}

	function mergeMappings(state, destination, source, overridableKeys) {
	  var sourceKeys, key, index, quantity;

	  if (!common.isObject(source)) {
	    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
	  }

	  sourceKeys = Object.keys(source);

	  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
	    key = sourceKeys[index];

	    if (!_hasOwnProperty.call(destination, key)) {
	      destination[key] = source[key];
	      overridableKeys[key] = true;
	    }
	  }
	}

	function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode) {
	  var index, quantity;

	  keyNode = String(keyNode);

	  if (_result === null) {
	    _result = {};
	  }

	  if (keyTag === 'tag:yaml.org,2002:merge') {
	    if (Array.isArray(valueNode)) {
	      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
	        mergeMappings(state, _result, valueNode[index], overridableKeys);
	      }
	    } else {
	      mergeMappings(state, _result, valueNode, overridableKeys);
	    }
	  } else {
	    if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
	      throwError(state, 'duplicated mapping key');
	    }
	    _result[keyNode] = valueNode;
	    delete overridableKeys[keyNode];
	  }

	  return _result;
	}

	function readLineBreak(state) {
	  var ch;

	  ch = state.input.charCodeAt(state.position);

	  if (ch === 0x0A /* LF */) {
	      state.position++;
	    } else if (ch === 0x0D /* CR */) {
	      state.position++;
	      if (state.input.charCodeAt(state.position) === 0x0A /* LF */) {
	          state.position++;
	        }
	    } else {
	    throwError(state, 'a line break is expected');
	  }

	  state.line += 1;
	  state.lineStart = state.position;
	}

	function skipSeparationSpace(state, allowComments, checkIndent) {
	  var lineBreaks = 0,
	      ch = state.input.charCodeAt(state.position);

	  while (ch !== 0) {
	    while (is_WHITE_SPACE(ch)) {
	      ch = state.input.charCodeAt(++state.position);
	    }

	    if (allowComments && ch === 0x23 /* # */) {
	        do {
	          ch = state.input.charCodeAt(++state.position);
	        } while (ch !== 0x0A /* LF */ && ch !== 0x0D /* CR */ && ch !== 0);
	      }

	    if (is_EOL(ch)) {
	      readLineBreak(state);

	      ch = state.input.charCodeAt(state.position);
	      lineBreaks++;
	      state.lineIndent = 0;

	      while (ch === 0x20 /* Space */) {
	        state.lineIndent++;
	        ch = state.input.charCodeAt(++state.position);
	      }
	    } else {
	      break;
	    }
	  }

	  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
	    throwWarning(state, 'deficient indentation');
	  }

	  return lineBreaks;
	}

	function testDocumentSeparator(state) {
	  var _position = state.position,
	      ch;

	  ch = state.input.charCodeAt(_position);

	  // Condition state.position === state.lineStart is tested
	  // in parent on each call, for efficiency. No needs to test here again.
	  if ((ch === 0x2D /* - */ || ch === 0x2E /* . */) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {

	    _position += 3;

	    ch = state.input.charCodeAt(_position);

	    if (ch === 0 || is_WS_OR_EOL(ch)) {
	      return true;
	    }
	  }

	  return false;
	}

	function writeFoldedLines(state, count) {
	  if (count === 1) {
	    state.result += ' ';
	  } else if (count > 1) {
	    state.result += common.repeat('\n', count - 1);
	  }
	}

	function readPlainScalar(state, nodeIndent, withinFlowCollection) {
	  var preceding,
	      following,
	      captureStart,
	      captureEnd,
	      hasPendingContent,
	      _line,
	      _lineStart,
	      _lineIndent,
	      _kind = state.kind,
	      _result = state.result,
	      ch;

	  ch = state.input.charCodeAt(state.position);

	  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 0x23 /* # */ || ch === 0x26 /* & */ || ch === 0x2A /* * */ || ch === 0x21 /* ! */ || ch === 0x7C /* | */ || ch === 0x3E /* > */ || ch === 0x27 /* ' */ || ch === 0x22 /* " */ || ch === 0x25 /* % */ || ch === 0x40 /* @ */ || ch === 0x60 /* ` */) {
	      return false;
	    }

	  if (ch === 0x3F /* ? */ || ch === 0x2D /* - */) {
	      following = state.input.charCodeAt(state.position + 1);

	      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
	        return false;
	      }
	    }

	  state.kind = 'scalar';
	  state.result = '';
	  captureStart = captureEnd = state.position;
	  hasPendingContent = false;

	  while (ch !== 0) {
	    if (ch === 0x3A /* : */) {
	        following = state.input.charCodeAt(state.position + 1);

	        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
	          break;
	        }
	      } else if (ch === 0x23 /* # */) {
	        preceding = state.input.charCodeAt(state.position - 1);

	        if (is_WS_OR_EOL(preceding)) {
	          break;
	        }
	      } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
	      break;
	    } else if (is_EOL(ch)) {
	      _line = state.line;
	      _lineStart = state.lineStart;
	      _lineIndent = state.lineIndent;
	      skipSeparationSpace(state, false, -1);

	      if (state.lineIndent >= nodeIndent) {
	        hasPendingContent = true;
	        ch = state.input.charCodeAt(state.position);
	        continue;
	      } else {
	        state.position = captureEnd;
	        state.line = _line;
	        state.lineStart = _lineStart;
	        state.lineIndent = _lineIndent;
	        break;
	      }
	    }

	    if (hasPendingContent) {
	      captureSegment(state, captureStart, captureEnd, false);
	      writeFoldedLines(state, state.line - _line);
	      captureStart = captureEnd = state.position;
	      hasPendingContent = false;
	    }

	    if (!is_WHITE_SPACE(ch)) {
	      captureEnd = state.position + 1;
	    }

	    ch = state.input.charCodeAt(++state.position);
	  }

	  captureSegment(state, captureStart, captureEnd, false);

	  if (state.result) {
	    return true;
	  }

	  state.kind = _kind;
	  state.result = _result;
	  return false;
	}

	function readSingleQuotedScalar(state, nodeIndent) {
	  var ch, captureStart, captureEnd;

	  ch = state.input.charCodeAt(state.position);

	  if (ch !== 0x27 /* ' */) {
	      return false;
	    }

	  state.kind = 'scalar';
	  state.result = '';
	  state.position++;
	  captureStart = captureEnd = state.position;

	  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
	    if (ch === 0x27 /* ' */) {
	        captureSegment(state, captureStart, state.position, true);
	        ch = state.input.charCodeAt(++state.position);

	        if (ch === 0x27 /* ' */) {
	            captureStart = state.position;
	            state.position++;
	            captureEnd = state.position;
	          } else {
	          return true;
	        }
	      } else if (is_EOL(ch)) {
	      captureSegment(state, captureStart, captureEnd, true);
	      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
	      captureStart = captureEnd = state.position;
	    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
	      throwError(state, 'unexpected end of the document within a single quoted scalar');
	    } else {
	      state.position++;
	      captureEnd = state.position;
	    }
	  }

	  throwError(state, 'unexpected end of the stream within a single quoted scalar');
	}

	function readDoubleQuotedScalar(state, nodeIndent) {
	  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;

	  ch = state.input.charCodeAt(state.position);

	  if (ch !== 0x22 /* " */) {
	      return false;
	    }

	  state.kind = 'scalar';
	  state.result = '';
	  state.position++;
	  captureStart = captureEnd = state.position;

	  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
	    if (ch === 0x22 /* " */) {
	        captureSegment(state, captureStart, state.position, true);
	        state.position++;
	        return true;
	      } else if (ch === 0x5C /* \ */) {
	        captureSegment(state, captureStart, state.position, true);
	        ch = state.input.charCodeAt(++state.position);

	        if (is_EOL(ch)) {
	          skipSeparationSpace(state, false, nodeIndent);

	          // TODO: rework to inline fn with no type cast?
	        } else if (ch < 256 && simpleEscapeCheck[ch]) {
	          state.result += simpleEscapeMap[ch];
	          state.position++;
	        } else if ((tmp = escapedHexLen(ch)) > 0) {
	          hexLength = tmp;
	          hexResult = 0;

	          for (; hexLength > 0; hexLength--) {
	            ch = state.input.charCodeAt(++state.position);

	            if ((tmp = fromHexCode(ch)) >= 0) {
	              hexResult = (hexResult << 4) + tmp;
	            } else {
	              throwError(state, 'expected hexadecimal character');
	            }
	          }

	          state.result += charFromCodepoint(hexResult);

	          state.position++;
	        } else {
	          throwError(state, 'unknown escape sequence');
	        }

	        captureStart = captureEnd = state.position;
	      } else if (is_EOL(ch)) {
	      captureSegment(state, captureStart, captureEnd, true);
	      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
	      captureStart = captureEnd = state.position;
	    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
	      throwError(state, 'unexpected end of the document within a double quoted scalar');
	    } else {
	      state.position++;
	      captureEnd = state.position;
	    }
	  }

	  throwError(state, 'unexpected end of the stream within a double quoted scalar');
	}

	function readFlowCollection(state, nodeIndent) {
	  var readNext = true,
	      _line,
	      _tag = state.tag,
	      _result,
	      _anchor = state.anchor,
	      following,
	      terminator,
	      isPair,
	      isExplicitPair,
	      isMapping,
	      overridableKeys = {},
	      keyNode,
	      keyTag,
	      valueNode,
	      ch;

	  ch = state.input.charCodeAt(state.position);

	  if (ch === 0x5B /* [ */) {
	      terminator = 0x5D; /* ] */
	      isMapping = false;
	      _result = [];
	    } else if (ch === 0x7B /* { */) {
	      terminator = 0x7D; /* } */
	      isMapping = true;
	      _result = {};
	    } else {
	    return false;
	  }

	  if (state.anchor !== null) {
	    state.anchorMap[state.anchor] = _result;
	  }

	  ch = state.input.charCodeAt(++state.position);

	  while (ch !== 0) {
	    skipSeparationSpace(state, true, nodeIndent);

	    ch = state.input.charCodeAt(state.position);

	    if (ch === terminator) {
	      state.position++;
	      state.tag = _tag;
	      state.anchor = _anchor;
	      state.kind = isMapping ? 'mapping' : 'sequence';
	      state.result = _result;
	      return true;
	    } else if (!readNext) {
	      throwError(state, 'missed comma between flow collection entries');
	    }

	    keyTag = keyNode = valueNode = null;
	    isPair = isExplicitPair = false;

	    if (ch === 0x3F /* ? */) {
	        following = state.input.charCodeAt(state.position + 1);

	        if (is_WS_OR_EOL(following)) {
	          isPair = isExplicitPair = true;
	          state.position++;
	          skipSeparationSpace(state, true, nodeIndent);
	        }
	      }

	    _line = state.line;
	    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
	    keyTag = state.tag;
	    keyNode = state.result;
	    skipSeparationSpace(state, true, nodeIndent);

	    ch = state.input.charCodeAt(state.position);

	    if ((isExplicitPair || state.line === _line) && ch === 0x3A /* : */) {
	        isPair = true;
	        ch = state.input.charCodeAt(++state.position);
	        skipSeparationSpace(state, true, nodeIndent);
	        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
	        valueNode = state.result;
	      }

	    if (isMapping) {
	      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
	    } else if (isPair) {
	      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
	    } else {
	      _result.push(keyNode);
	    }

	    skipSeparationSpace(state, true, nodeIndent);

	    ch = state.input.charCodeAt(state.position);

	    if (ch === 0x2C /* , */) {
	        readNext = true;
	        ch = state.input.charCodeAt(++state.position);
	      } else {
	      readNext = false;
	    }
	  }

	  throwError(state, 'unexpected end of the stream within a flow collection');
	}

	function readBlockScalar(state, nodeIndent) {
	  var captureStart,
	      folding,
	      chomping = CHOMPING_CLIP,
	      didReadContent = false,
	      detectedIndent = false,
	      textIndent = nodeIndent,
	      emptyLines = 0,
	      atMoreIndented = false,
	      tmp,
	      ch;

	  ch = state.input.charCodeAt(state.position);

	  if (ch === 0x7C /* | */) {
	      folding = false;
	    } else if (ch === 0x3E /* > */) {
	      folding = true;
	    } else {
	    return false;
	  }

	  state.kind = 'scalar';
	  state.result = '';

	  while (ch !== 0) {
	    ch = state.input.charCodeAt(++state.position);

	    if (ch === 0x2B /* + */ || ch === 0x2D /* - */) {
	        if (CHOMPING_CLIP === chomping) {
	          chomping = ch === 0x2B /* + */ ? CHOMPING_KEEP : CHOMPING_STRIP;
	        } else {
	          throwError(state, 'repeat of a chomping mode identifier');
	        }
	      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
	      if (tmp === 0) {
	        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
	      } else if (!detectedIndent) {
	        textIndent = nodeIndent + tmp - 1;
	        detectedIndent = true;
	      } else {
	        throwError(state, 'repeat of an indentation width identifier');
	      }
	    } else {
	      break;
	    }
	  }

	  if (is_WHITE_SPACE(ch)) {
	    do {
	      ch = state.input.charCodeAt(++state.position);
	    } while (is_WHITE_SPACE(ch));

	    if (ch === 0x23 /* # */) {
	        do {
	          ch = state.input.charCodeAt(++state.position);
	        } while (!is_EOL(ch) && ch !== 0);
	      }
	  }

	  while (ch !== 0) {
	    readLineBreak(state);
	    state.lineIndent = 0;

	    ch = state.input.charCodeAt(state.position);

	    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20 /* Space */) {
	      state.lineIndent++;
	      ch = state.input.charCodeAt(++state.position);
	    }

	    if (!detectedIndent && state.lineIndent > textIndent) {
	      textIndent = state.lineIndent;
	    }

	    if (is_EOL(ch)) {
	      emptyLines++;
	      continue;
	    }

	    // End of the scalar.
	    if (state.lineIndent < textIndent) {

	      // Perform the chomping.
	      if (chomping === CHOMPING_KEEP) {
	        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
	      } else if (chomping === CHOMPING_CLIP) {
	        if (didReadContent) {
	          // i.e. only if the scalar is not empty.
	          state.result += '\n';
	        }
	      }

	      // Break this `while` cycle and go to the funciton's epilogue.
	      break;
	    }

	    // Folded style: use fancy rules to handle line breaks.
	    if (folding) {

	      // Lines starting with white space characters (more-indented lines) are not folded.
	      if (is_WHITE_SPACE(ch)) {
	        atMoreIndented = true;
	        // except for the first content line (cf. Example 8.1)
	        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

	        // End of more-indented block.
	      } else if (atMoreIndented) {
	        atMoreIndented = false;
	        state.result += common.repeat('\n', emptyLines + 1);

	        // Just one line break - perceive as the same line.
	      } else if (emptyLines === 0) {
	        if (didReadContent) {
	          // i.e. only if we have already read some scalar content.
	          state.result += ' ';
	        }

	        // Several line breaks - perceive as different lines.
	      } else {
	        state.result += common.repeat('\n', emptyLines);
	      }

	      // Literal style: just add exact number of line breaks between content lines.
	    } else {
	      // Keep all line breaks except the header line break.
	      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
	    }

	    didReadContent = true;
	    detectedIndent = true;
	    emptyLines = 0;
	    captureStart = state.position;

	    while (!is_EOL(ch) && ch !== 0) {
	      ch = state.input.charCodeAt(++state.position);
	    }

	    captureSegment(state, captureStart, state.position, false);
	  }

	  return true;
	}

	function readBlockSequence(state, nodeIndent) {
	  var _line,
	      _tag = state.tag,
	      _anchor = state.anchor,
	      _result = [],
	      following,
	      detected = false,
	      ch;

	  if (state.anchor !== null) {
	    state.anchorMap[state.anchor] = _result;
	  }

	  ch = state.input.charCodeAt(state.position);

	  while (ch !== 0) {

	    if (ch !== 0x2D /* - */) {
	        break;
	      }

	    following = state.input.charCodeAt(state.position + 1);

	    if (!is_WS_OR_EOL(following)) {
	      break;
	    }

	    detected = true;
	    state.position++;

	    if (skipSeparationSpace(state, true, -1)) {
	      if (state.lineIndent <= nodeIndent) {
	        _result.push(null);
	        ch = state.input.charCodeAt(state.position);
	        continue;
	      }
	    }

	    _line = state.line;
	    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
	    _result.push(state.result);
	    skipSeparationSpace(state, true, -1);

	    ch = state.input.charCodeAt(state.position);

	    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
	      throwError(state, 'bad indentation of a sequence entry');
	    } else if (state.lineIndent < nodeIndent) {
	      break;
	    }
	  }

	  if (detected) {
	    state.tag = _tag;
	    state.anchor = _anchor;
	    state.kind = 'sequence';
	    state.result = _result;
	    return true;
	  }
	  return false;
	}

	function readBlockMapping(state, nodeIndent, flowIndent) {
	  var following,
	      allowCompact,
	      _line,
	      _tag = state.tag,
	      _anchor = state.anchor,
	      _result = {},
	      overridableKeys = {},
	      keyTag = null,
	      keyNode = null,
	      valueNode = null,
	      atExplicitKey = false,
	      detected = false,
	      ch;

	  if (state.anchor !== null) {
	    state.anchorMap[state.anchor] = _result;
	  }

	  ch = state.input.charCodeAt(state.position);

	  while (ch !== 0) {
	    following = state.input.charCodeAt(state.position + 1);
	    _line = state.line; // Save the current line.

	    //
	    // Explicit notation case. There are two separate blocks:
	    // first for the key (denoted by "?") and second for the value (denoted by ":")
	    //
	    if ((ch === 0x3F /* ? */ || ch === 0x3A /* : */) && is_WS_OR_EOL(following)) {

	      if (ch === 0x3F /* ? */) {
	          if (atExplicitKey) {
	            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
	            keyTag = keyNode = valueNode = null;
	          }

	          detected = true;
	          atExplicitKey = true;
	          allowCompact = true;
	        } else if (atExplicitKey) {
	        // i.e. 0x3A/* : */ === character after the explicit key.
	        atExplicitKey = false;
	        allowCompact = true;
	      } else {
	        throwError(state, 'incomplete explicit mapping pair; a key node is missed');
	      }

	      state.position += 1;
	      ch = following;

	      //
	      // Implicit notation case. Flow-style node as the key first, then ":", and the value.
	      //
	    } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

	      if (state.line === _line) {
	        ch = state.input.charCodeAt(state.position);

	        while (is_WHITE_SPACE(ch)) {
	          ch = state.input.charCodeAt(++state.position);
	        }

	        if (ch === 0x3A /* : */) {
	            ch = state.input.charCodeAt(++state.position);

	            if (!is_WS_OR_EOL(ch)) {
	              throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
	            }

	            if (atExplicitKey) {
	              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
	              keyTag = keyNode = valueNode = null;
	            }

	            detected = true;
	            atExplicitKey = false;
	            allowCompact = false;
	            keyTag = state.tag;
	            keyNode = state.result;
	          } else if (detected) {
	          throwError(state, 'can not read an implicit mapping pair; a colon is missed');
	        } else {
	          state.tag = _tag;
	          state.anchor = _anchor;
	          return true; // Keep the result of `composeNode`.
	        }
	      } else if (detected) {
	        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');
	      } else {
	        state.tag = _tag;
	        state.anchor = _anchor;
	        return true; // Keep the result of `composeNode`.
	      }
	    } else {
	        break; // Reading is done. Go to the epilogue.
	      }

	    //
	    // Common reading code for both explicit and implicit notations.
	    //
	    if (state.line === _line || state.lineIndent > nodeIndent) {
	      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
	        if (atExplicitKey) {
	          keyNode = state.result;
	        } else {
	          valueNode = state.result;
	        }
	      }

	      if (!atExplicitKey) {
	        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
	        keyTag = keyNode = valueNode = null;
	      }

	      skipSeparationSpace(state, true, -1);
	      ch = state.input.charCodeAt(state.position);
	    }

	    if (state.lineIndent > nodeIndent && ch !== 0) {
	      throwError(state, 'bad indentation of a mapping entry');
	    } else if (state.lineIndent < nodeIndent) {
	      break;
	    }
	  }

	  //
	  // Epilogue.
	  //

	  // Special case: last mapping's node contains only the key in explicit notation.
	  if (atExplicitKey) {
	    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
	  }

	  // Expose the resulting mapping.
	  if (detected) {
	    state.tag = _tag;
	    state.anchor = _anchor;
	    state.kind = 'mapping';
	    state.result = _result;
	  }

	  return detected;
	}

	function readTagProperty(state) {
	  var _position,
	      isVerbatim = false,
	      isNamed = false,
	      tagHandle,
	      tagName,
	      ch;

	  ch = state.input.charCodeAt(state.position);

	  if (ch !== 0x21 /* ! */) return false;

	  if (state.tag !== null) {
	    throwError(state, 'duplication of a tag property');
	  }

	  ch = state.input.charCodeAt(++state.position);

	  if (ch === 0x3C /* < */) {
	      isVerbatim = true;
	      ch = state.input.charCodeAt(++state.position);
	    } else if (ch === 0x21 /* ! */) {
	      isNamed = true;
	      tagHandle = '!!';
	      ch = state.input.charCodeAt(++state.position);
	    } else {
	    tagHandle = '!';
	  }

	  _position = state.position;

	  if (isVerbatim) {
	    do {
	      ch = state.input.charCodeAt(++state.position);
	    } while (ch !== 0 && ch !== 0x3E /* > */);

	    if (state.position < state.length) {
	      tagName = state.input.slice(_position, state.position);
	      ch = state.input.charCodeAt(++state.position);
	    } else {
	      throwError(state, 'unexpected end of the stream within a verbatim tag');
	    }
	  } else {
	    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

	      if (ch === 0x21 /* ! */) {
	          if (!isNamed) {
	            tagHandle = state.input.slice(_position - 1, state.position + 1);

	            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
	              throwError(state, 'named tag handle cannot contain such characters');
	            }

	            isNamed = true;
	            _position = state.position + 1;
	          } else {
	            throwError(state, 'tag suffix cannot contain exclamation marks');
	          }
	        }

	      ch = state.input.charCodeAt(++state.position);
	    }

	    tagName = state.input.slice(_position, state.position);

	    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
	      throwError(state, 'tag suffix cannot contain flow indicator characters');
	    }
	  }

	  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
	    throwError(state, 'tag name cannot contain such characters: ' + tagName);
	  }

	  if (isVerbatim) {
	    state.tag = tagName;
	  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
	    state.tag = state.tagMap[tagHandle] + tagName;
	  } else if (tagHandle === '!') {
	    state.tag = '!' + tagName;
	  } else if (tagHandle === '!!') {
	    state.tag = 'tag:yaml.org,2002:' + tagName;
	  } else {
	    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
	  }

	  return true;
	}

	function readAnchorProperty(state) {
	  var _position, ch;

	  ch = state.input.charCodeAt(state.position);

	  if (ch !== 0x26 /* & */) return false;

	  if (state.anchor !== null) {
	    throwError(state, 'duplication of an anchor property');
	  }

	  ch = state.input.charCodeAt(++state.position);
	  _position = state.position;

	  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
	    ch = state.input.charCodeAt(++state.position);
	  }

	  if (state.position === _position) {
	    throwError(state, 'name of an anchor node must contain at least one character');
	  }

	  state.anchor = state.input.slice(_position, state.position);
	  return true;
	}

	function readAlias(state) {
	  var _position, alias, ch;

	  ch = state.input.charCodeAt(state.position);

	  if (ch !== 0x2A /* * */) return false;

	  ch = state.input.charCodeAt(++state.position);
	  _position = state.position;

	  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
	    ch = state.input.charCodeAt(++state.position);
	  }

	  if (state.position === _position) {
	    throwError(state, 'name of an alias node must contain at least one character');
	  }

	  alias = state.input.slice(_position, state.position);

	  if (!state.anchorMap.hasOwnProperty(alias)) {
	    throwError(state, 'unidentified alias "' + alias + '"');
	  }

	  state.result = state.anchorMap[alias];
	  skipSeparationSpace(state, true, -1);
	  return true;
	}

	function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
	  var allowBlockStyles,
	      allowBlockScalars,
	      allowBlockCollections,
	      indentStatus = 1,
	      // 1: this>parent, 0: this=parent, -1: this<parent
	  atNewLine = false,
	      hasContent = false,
	      typeIndex,
	      typeQuantity,
	      type,
	      flowIndent,
	      blockIndent;

	  if (state.listener !== null) {
	    state.listener('open', state);
	  }

	  state.tag = null;
	  state.anchor = null;
	  state.kind = null;
	  state.result = null;

	  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;

	  if (allowToSeek) {
	    if (skipSeparationSpace(state, true, -1)) {
	      atNewLine = true;

	      if (state.lineIndent > parentIndent) {
	        indentStatus = 1;
	      } else if (state.lineIndent === parentIndent) {
	        indentStatus = 0;
	      } else if (state.lineIndent < parentIndent) {
	        indentStatus = -1;
	      }
	    }
	  }

	  if (indentStatus === 1) {
	    while (readTagProperty(state) || readAnchorProperty(state)) {
	      if (skipSeparationSpace(state, true, -1)) {
	        atNewLine = true;
	        allowBlockCollections = allowBlockStyles;

	        if (state.lineIndent > parentIndent) {
	          indentStatus = 1;
	        } else if (state.lineIndent === parentIndent) {
	          indentStatus = 0;
	        } else if (state.lineIndent < parentIndent) {
	          indentStatus = -1;
	        }
	      } else {
	        allowBlockCollections = false;
	      }
	    }
	  }

	  if (allowBlockCollections) {
	    allowBlockCollections = atNewLine || allowCompact;
	  }

	  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
	    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
	      flowIndent = parentIndent;
	    } else {
	      flowIndent = parentIndent + 1;
	    }

	    blockIndent = state.position - state.lineStart;

	    if (indentStatus === 1) {
	      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
	        hasContent = true;
	      } else {
	        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
	          hasContent = true;
	        } else if (readAlias(state)) {
	          hasContent = true;

	          if (state.tag !== null || state.anchor !== null) {
	            throwError(state, 'alias node should not have any properties');
	          }
	        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
	          hasContent = true;

	          if (state.tag === null) {
	            state.tag = '?';
	          }
	        }

	        if (state.anchor !== null) {
	          state.anchorMap[state.anchor] = state.result;
	        }
	      }
	    } else if (indentStatus === 0) {
	      // Special case: block sequences are allowed to have same indentation level as the parent.
	      // http://www.yaml.org/spec/1.2/spec.html#id2799784
	      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
	    }
	  }

	  if (state.tag !== null && state.tag !== '!') {
	    if (state.tag === '?') {
	      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
	        type = state.implicitTypes[typeIndex];

	        // Implicit resolving is not allowed for non-scalar types, and '?'
	        // non-specific tag is only assigned to plain scalars. So, it isn't
	        // needed to check for 'kind' conformity.

	        if (type.resolve(state.result)) {
	          // `state.result` updated in resolver if matched
	          state.result = type.construct(state.result);
	          state.tag = type.tag;
	          if (state.anchor !== null) {
	            state.anchorMap[state.anchor] = state.result;
	          }
	          break;
	        }
	      }
	    } else if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
	      type = state.typeMap[state.kind || 'fallback'][state.tag];

	      if (state.result !== null && type.kind !== state.kind) {
	        throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
	      }

	      if (!type.resolve(state.result)) {
	        // `state.result` updated in resolver if matched
	        throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
	      } else {
	        state.result = type.construct(state.result);
	        if (state.anchor !== null) {
	          state.anchorMap[state.anchor] = state.result;
	        }
	      }
	    } else {
	      throwError(state, 'unknown tag !<' + state.tag + '>');
	    }
	  }

	  if (state.listener !== null) {
	    state.listener('close', state);
	  }
	  return state.tag !== null || state.anchor !== null || hasContent;
	}

	function readDocument(state) {
	  var documentStart = state.position,
	      _position,
	      directiveName,
	      directiveArgs,
	      hasDirectives = false,
	      ch;

	  state.version = null;
	  state.checkLineBreaks = state.legacy;
	  state.tagMap = {};
	  state.anchorMap = {};

	  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
	    skipSeparationSpace(state, true, -1);

	    ch = state.input.charCodeAt(state.position);

	    if (state.lineIndent > 0 || ch !== 0x25 /* % */) {
	        break;
	      }

	    hasDirectives = true;
	    ch = state.input.charCodeAt(++state.position);
	    _position = state.position;

	    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
	      ch = state.input.charCodeAt(++state.position);
	    }

	    directiveName = state.input.slice(_position, state.position);
	    directiveArgs = [];

	    if (directiveName.length < 1) {
	      throwError(state, 'directive name must not be less than one character in length');
	    }

	    while (ch !== 0) {
	      while (is_WHITE_SPACE(ch)) {
	        ch = state.input.charCodeAt(++state.position);
	      }

	      if (ch === 0x23 /* # */) {
	          do {
	            ch = state.input.charCodeAt(++state.position);
	          } while (ch !== 0 && !is_EOL(ch));
	          break;
	        }

	      if (is_EOL(ch)) break;

	      _position = state.position;

	      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
	        ch = state.input.charCodeAt(++state.position);
	      }

	      directiveArgs.push(state.input.slice(_position, state.position));
	    }

	    if (ch !== 0) readLineBreak(state);

	    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
	      directiveHandlers[directiveName](state, directiveName, directiveArgs);
	    } else {
	      throwWarning(state, 'unknown document directive "' + directiveName + '"');
	    }
	  }

	  skipSeparationSpace(state, true, -1);

	  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 0x2D /* - */ && state.input.charCodeAt(state.position + 1) === 0x2D /* - */ && state.input.charCodeAt(state.position + 2) === 0x2D /* - */) {
	      state.position += 3;
	      skipSeparationSpace(state, true, -1);
	    } else if (hasDirectives) {
	    throwError(state, 'directives end mark is expected');
	  }

	  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
	  skipSeparationSpace(state, true, -1);

	  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
	    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
	  }

	  state.documents.push(state.result);

	  if (state.position === state.lineStart && testDocumentSeparator(state)) {

	    if (state.input.charCodeAt(state.position) === 0x2E /* . */) {
	        state.position += 3;
	        skipSeparationSpace(state, true, -1);
	      }
	    return;
	  }

	  if (state.position < state.length - 1) {
	    throwError(state, 'end of the stream or a document separator is expected');
	  } else {
	    return;
	  }
	}

	function loadDocuments(input, options) {
	  input = String(input);
	  options = options || {};

	  if (input.length !== 0) {

	    // Add tailing `\n` if not exists
	    if (input.charCodeAt(input.length - 1) !== 0x0A /* LF */ && input.charCodeAt(input.length - 1) !== 0x0D /* CR */) {
	        input += '\n';
	      }

	    // Strip BOM
	    if (input.charCodeAt(0) === 0xFEFF) {
	      input = input.slice(1);
	    }
	  }

	  var state = new State(input, options);

	  // Use 0 as string terminator. That significantly simplifies bounds check.
	  state.input += '\0';

	  while (state.input.charCodeAt(state.position) === 0x20 /* Space */) {
	    state.lineIndent += 1;
	    state.position += 1;
	  }

	  while (state.position < state.length - 1) {
	    readDocument(state);
	  }

	  return state.documents;
	}

	function loadAll(input, iterator, options) {
	  var documents = loadDocuments(input, options),
	      index,
	      length;

	  for (index = 0, length = documents.length; index < length; index += 1) {
	    iterator(documents[index]);
	  }
	}

	function load(input, options) {
	  var documents = loadDocuments(input, options);

	  if (documents.length === 0) {
	    /*eslint-disable no-undefined*/
	    return undefined;
	  } else if (documents.length === 1) {
	    return documents[0];
	  }
	  throw new YAMLException('expected a single document in the stream, but found more');
	}

	function safeLoadAll(input, output, options) {
	  loadAll(input, output, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
	}

	function safeLoad(input, options) {
	  return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
	}

	module.exports.loadAll = loadAll;
	module.exports.load = load;
	module.exports.safeLoadAll = safeLoadAll;
	module.exports.safeLoad = safeLoad;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function isNothing(subject) {
	  return typeof subject === 'undefined' || subject === null;
	}

	function isObject(subject) {
	  return (typeof subject === 'undefined' ? 'undefined' : _typeof(subject)) === 'object' && subject !== null;
	}

	function toArray(sequence) {
	  if (Array.isArray(sequence)) return sequence;else if (isNothing(sequence)) return [];

	  return [sequence];
	}

	function extend(target, source) {
	  var index, length, key, sourceKeys;

	  if (source) {
	    sourceKeys = Object.keys(source);

	    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
	      key = sourceKeys[index];
	      target[key] = source[key];
	    }
	  }

	  return target;
	}

	function repeat(string, count) {
	  var result = '',
	      cycle;

	  for (cycle = 0; cycle < count; cycle += 1) {
	    result += string;
	  }

	  return result;
	}

	function isNegativeZero(number) {
	  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
	}

	module.exports.isNothing = isNothing;
	module.exports.isObject = isObject;
	module.exports.toArray = toArray;
	module.exports.repeat = repeat;
	module.exports.isNegativeZero = isNegativeZero;
	module.exports.extend = extend;

/***/ },
/* 8 */
/***/ function(module, exports) {

	// YAML error class. http://stackoverflow.com/questions/8458984
	//
	'use strict';

	function YAMLException(reason, mark) {
	  // Super constructor
	  Error.call(this);

	  // Include stack trace in error object
	  if (Error.captureStackTrace) {
	    // Chrome and NodeJS
	    Error.captureStackTrace(this, this.constructor);
	  } else {
	    // FF, IE 10+ and Safari 6+. Fallback for others
	    this.stack = new Error().stack || '';
	  }

	  this.name = 'YAMLException';
	  this.reason = reason;
	  this.mark = mark;
	  this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');
	}

	// Inherit from Error
	YAMLException.prototype = Object.create(Error.prototype);
	YAMLException.prototype.constructor = YAMLException;

	YAMLException.prototype.toString = function toString(compact) {
	  var result = this.name + ': ';

	  result += this.reason || '(unknown reason)';

	  if (!compact && this.mark) {
	    result += ' ' + this.mark.toString();
	  }

	  return result;
	};

	module.exports = YAMLException;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var common = __webpack_require__(7);

	function Mark(name, buffer, position, line, column) {
	  this.name = name;
	  this.buffer = buffer;
	  this.position = position;
	  this.line = line;
	  this.column = column;
	}

	Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
	  var head, start, tail, end, snippet;

	  if (!this.buffer) return null;

	  indent = indent || 4;
	  maxLength = maxLength || 75;

	  head = '';
	  start = this.position;

	  while (start > 0 && '\0\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
	    start -= 1;
	    if (this.position - start > maxLength / 2 - 1) {
	      head = ' ... ';
	      start += 5;
	      break;
	    }
	  }

	  tail = '';
	  end = this.position;

	  while (end < this.buffer.length && '\0\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
	    end += 1;
	    if (end - this.position > maxLength / 2 - 1) {
	      tail = ' ... ';
	      end -= 5;
	      break;
	    }
	  }

	  snippet = this.buffer.slice(start, end);

	  return common.repeat(' ', indent) + head + snippet + tail + '\n' + common.repeat(' ', indent + this.position - start + head.length) + '^';
	};

	Mark.prototype.toString = function toString(compact) {
	  var snippet,
	      where = '';

	  if (this.name) {
	    where += 'in "' + this.name + '" ';
	  }

	  where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

	  if (!compact) {
	    snippet = this.getSnippet();

	    if (snippet) {
	      where += ':\n' + snippet;
	    }
	  }

	  return where;
	};

	module.exports = Mark;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// JS-YAML's default schema for `safeLoad` function.
	// It is not described in the YAML specification.
	//
	// This schema is based on standard YAML's Core schema and includes most of
	// extra types described at YAML tag repository. (http://yaml.org/type/)


	'use strict';

	var Schema = __webpack_require__(11);

	module.exports = new Schema({
	  include: [__webpack_require__(13)],
	  implicit: [__webpack_require__(23), __webpack_require__(24)],
	  explicit: [__webpack_require__(25), __webpack_require__(27), __webpack_require__(28), __webpack_require__(29)]
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*eslint-disable max-len*/

	var common = __webpack_require__(7);
	var YAMLException = __webpack_require__(8);
	var Type = __webpack_require__(12);

	function compileList(schema, name, result) {
	  var exclude = [];

	  schema.include.forEach(function (includedSchema) {
	    result = compileList(includedSchema, name, result);
	  });

	  schema[name].forEach(function (currentType) {
	    result.forEach(function (previousType, previousIndex) {
	      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
	        exclude.push(previousIndex);
	      }
	    });

	    result.push(currentType);
	  });

	  return result.filter(function (type, index) {
	    return exclude.indexOf(index) === -1;
	  });
	}

	function compileMap() /* lists... */{
	  var result = {
	    scalar: {},
	    sequence: {},
	    mapping: {},
	    fallback: {}
	  },
	      index,
	      length;

	  function collectType(type) {
	    result[type.kind][type.tag] = result['fallback'][type.tag] = type;
	  }

	  for (index = 0, length = arguments.length; index < length; index += 1) {
	    arguments[index].forEach(collectType);
	  }
	  return result;
	}

	function Schema(definition) {
	  this.include = definition.include || [];
	  this.implicit = definition.implicit || [];
	  this.explicit = definition.explicit || [];

	  this.implicit.forEach(function (type) {
	    if (type.loadKind && type.loadKind !== 'scalar') {
	      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
	    }
	  });

	  this.compiledImplicit = compileList(this, 'implicit', []);
	  this.compiledExplicit = compileList(this, 'explicit', []);
	  this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
	}

	Schema.DEFAULT = null;

	Schema.create = function createSchema() {
	  var schemas, types;

	  switch (arguments.length) {
	    case 1:
	      schemas = Schema.DEFAULT;
	      types = arguments[0];
	      break;

	    case 2:
	      schemas = arguments[0];
	      types = arguments[1];
	      break;

	    default:
	      throw new YAMLException('Wrong number of arguments for Schema.create function');
	  }

	  schemas = common.toArray(schemas);
	  types = common.toArray(types);

	  if (!schemas.every(function (schema) {
	    return schema instanceof Schema;
	  })) {
	    throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
	  }

	  if (!types.every(function (type) {
	    return type instanceof Type;
	  })) {
	    throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
	  }

	  return new Schema({
	    include: schemas,
	    explicit: types
	  });
	};

	module.exports = Schema;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var YAMLException = __webpack_require__(8);

	var TYPE_CONSTRUCTOR_OPTIONS = ['kind', 'resolve', 'construct', 'instanceOf', 'predicate', 'represent', 'defaultStyle', 'styleAliases'];

	var YAML_NODE_KINDS = ['scalar', 'sequence', 'mapping'];

	function compileStyleAliases(map) {
	  var result = {};

	  if (map !== null) {
	    Object.keys(map).forEach(function (style) {
	      map[style].forEach(function (alias) {
	        result[String(alias)] = style;
	      });
	    });
	  }

	  return result;
	}

	function Type(tag, options) {
	  options = options || {};

	  Object.keys(options).forEach(function (name) {
	    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
	      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
	    }
	  });

	  // TODO: Add tag format check.
	  this.tag = tag;
	  this.kind = options['kind'] || null;
	  this.resolve = options['resolve'] || function () {
	    return true;
	  };
	  this.construct = options['construct'] || function (data) {
	    return data;
	  };
	  this.instanceOf = options['instanceOf'] || null;
	  this.predicate = options['predicate'] || null;
	  this.represent = options['represent'] || null;
	  this.defaultStyle = options['defaultStyle'] || null;
	  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

	  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
	    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
	  }
	}

	module.exports = Type;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// Standard YAML's Core schema.
	// http://www.yaml.org/spec/1.2/spec.html#id2804923
	//
	// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
	// So, Core schema has no distinctions from JSON schema is JS-YAML.


	'use strict';

	var Schema = __webpack_require__(11);

	module.exports = new Schema({
	  include: [__webpack_require__(14)]
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// Standard YAML's JSON schema.
	// http://www.yaml.org/spec/1.2/spec.html#id2803231
	//
	// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
	// So, this schema is not such strict as defined in the YAML specification.
	// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


	'use strict';

	var Schema = __webpack_require__(11);

	module.exports = new Schema({
	  include: [__webpack_require__(15)],
	  implicit: [__webpack_require__(19), __webpack_require__(20), __webpack_require__(21), __webpack_require__(22)]
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// Standard YAML's Failsafe schema.
	// http://www.yaml.org/spec/1.2/spec.html#id2802346


	'use strict';

	var Schema = __webpack_require__(11);

	module.exports = new Schema({
	  explicit: [__webpack_require__(16), __webpack_require__(17), __webpack_require__(18)]
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	module.exports = new Type('tag:yaml.org,2002:str', {
	  kind: 'scalar',
	  construct: function construct(data) {
	    return data !== null ? data : '';
	  }
	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	module.exports = new Type('tag:yaml.org,2002:seq', {
	  kind: 'sequence',
	  construct: function construct(data) {
	    return data !== null ? data : [];
	  }
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	module.exports = new Type('tag:yaml.org,2002:map', {
	  kind: 'mapping',
	  construct: function construct(data) {
	    return data !== null ? data : {};
	  }
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	function resolveYamlNull(data) {
	  if (data === null) return true;

	  var max = data.length;

	  return max === 1 && data === '~' || max === 4 && (data === 'null' || data === 'Null' || data === 'NULL');
	}

	function constructYamlNull() {
	  return null;
	}

	function isNull(object) {
	  return object === null;
	}

	module.exports = new Type('tag:yaml.org,2002:null', {
	  kind: 'scalar',
	  resolve: resolveYamlNull,
	  construct: constructYamlNull,
	  predicate: isNull,
	  represent: {
	    canonical: function canonical() {
	      return '~';
	    },
	    lowercase: function lowercase() {
	      return 'null';
	    },
	    uppercase: function uppercase() {
	      return 'NULL';
	    },
	    camelcase: function camelcase() {
	      return 'Null';
	    }
	  },
	  defaultStyle: 'lowercase'
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	function resolveYamlBoolean(data) {
	  if (data === null) return false;

	  var max = data.length;

	  return max === 4 && (data === 'true' || data === 'True' || data === 'TRUE') || max === 5 && (data === 'false' || data === 'False' || data === 'FALSE');
	}

	function constructYamlBoolean(data) {
	  return data === 'true' || data === 'True' || data === 'TRUE';
	}

	function isBoolean(object) {
	  return Object.prototype.toString.call(object) === '[object Boolean]';
	}

	module.exports = new Type('tag:yaml.org,2002:bool', {
	  kind: 'scalar',
	  resolve: resolveYamlBoolean,
	  construct: constructYamlBoolean,
	  predicate: isBoolean,
	  represent: {
	    lowercase: function lowercase(object) {
	      return object ? 'true' : 'false';
	    },
	    uppercase: function uppercase(object) {
	      return object ? 'TRUE' : 'FALSE';
	    },
	    camelcase: function camelcase(object) {
	      return object ? 'True' : 'False';
	    }
	  },
	  defaultStyle: 'lowercase'
	});

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var common = __webpack_require__(7);
	var Type = __webpack_require__(12);

	function isHexCode(c) {
	  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */ || 0x41 /* A */ <= c && c <= 0x46 /* F */ || 0x61 /* a */ <= c && c <= 0x66 /* f */;
	}

	function isOctCode(c) {
	  return 0x30 /* 0 */ <= c && c <= 0x37 /* 7 */;
	}

	function isDecCode(c) {
	  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */;
	}

	function resolveYamlInteger(data) {
	  if (data === null) return false;

	  var max = data.length,
	      index = 0,
	      hasDigits = false,
	      ch;

	  if (!max) return false;

	  ch = data[index];

	  // sign
	  if (ch === '-' || ch === '+') {
	    ch = data[++index];
	  }

	  if (ch === '0') {
	    // 0
	    if (index + 1 === max) return true;
	    ch = data[++index];

	    // base 2, base 8, base 16

	    if (ch === 'b') {
	      // base 2
	      index++;

	      for (; index < max; index++) {
	        ch = data[index];
	        if (ch === '_') continue;
	        if (ch !== '0' && ch !== '1') return false;
	        hasDigits = true;
	      }
	      return hasDigits;
	    }

	    if (ch === 'x') {
	      // base 16
	      index++;

	      for (; index < max; index++) {
	        ch = data[index];
	        if (ch === '_') continue;
	        if (!isHexCode(data.charCodeAt(index))) return false;
	        hasDigits = true;
	      }
	      return hasDigits;
	    }

	    // base 8
	    for (; index < max; index++) {
	      ch = data[index];
	      if (ch === '_') continue;
	      if (!isOctCode(data.charCodeAt(index))) return false;
	      hasDigits = true;
	    }
	    return hasDigits;
	  }

	  // base 10 (except 0) or base 60

	  for (; index < max; index++) {
	    ch = data[index];
	    if (ch === '_') continue;
	    if (ch === ':') break;
	    if (!isDecCode(data.charCodeAt(index))) {
	      return false;
	    }
	    hasDigits = true;
	  }

	  if (!hasDigits) return false;

	  // if !base60 - done;
	  if (ch !== ':') return true;

	  // base60 almost not used, no needs to optimize
	  return (/^(:[0-5]?[0-9])+$/.test(data.slice(index))
	  );
	}

	function constructYamlInteger(data) {
	  var value = data,
	      sign = 1,
	      ch,
	      base,
	      digits = [];

	  if (value.indexOf('_') !== -1) {
	    value = value.replace(/_/g, '');
	  }

	  ch = value[0];

	  if (ch === '-' || ch === '+') {
	    if (ch === '-') sign = -1;
	    value = value.slice(1);
	    ch = value[0];
	  }

	  if (value === '0') return 0;

	  if (ch === '0') {
	    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
	    if (value[1] === 'x') return sign * parseInt(value, 16);
	    return sign * parseInt(value, 8);
	  }

	  if (value.indexOf(':') !== -1) {
	    value.split(':').forEach(function (v) {
	      digits.unshift(parseInt(v, 10));
	    });

	    value = 0;
	    base = 1;

	    digits.forEach(function (d) {
	      value += d * base;
	      base *= 60;
	    });

	    return sign * value;
	  }

	  return sign * parseInt(value, 10);
	}

	function isInteger(object) {
	  return Object.prototype.toString.call(object) === '[object Number]' && object % 1 === 0 && !common.isNegativeZero(object);
	}

	module.exports = new Type('tag:yaml.org,2002:int', {
	  kind: 'scalar',
	  resolve: resolveYamlInteger,
	  construct: constructYamlInteger,
	  predicate: isInteger,
	  represent: {
	    binary: function binary(object) {
	      return '0b' + object.toString(2);
	    },
	    octal: function octal(object) {
	      return '0' + object.toString(8);
	    },
	    decimal: function decimal(object) {
	      return object.toString(10);
	    },
	    hexadecimal: function hexadecimal(object) {
	      return '0x' + object.toString(16).toUpperCase();
	    }
	  },
	  defaultStyle: 'decimal',
	  styleAliases: {
	    binary: [2, 'bin'],
	    octal: [8, 'oct'],
	    decimal: [10, 'dec'],
	    hexadecimal: [16, 'hex']
	  }
	});

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var common = __webpack_require__(7);
	var Type = __webpack_require__(12);

	var YAML_FLOAT_PATTERN = new RegExp('^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?' + '|\\.[0-9_]+(?:[eE][-+][0-9]+)?' + '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' + '|[-+]?\\.(?:inf|Inf|INF)' + '|\\.(?:nan|NaN|NAN))$');

	function resolveYamlFloat(data) {
	  if (data === null) return false;

	  if (!YAML_FLOAT_PATTERN.test(data)) return false;

	  return true;
	}

	function constructYamlFloat(data) {
	  var value, sign, base, digits;

	  value = data.replace(/_/g, '').toLowerCase();
	  sign = value[0] === '-' ? -1 : 1;
	  digits = [];

	  if ('+-'.indexOf(value[0]) >= 0) {
	    value = value.slice(1);
	  }

	  if (value === '.inf') {
	    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
	  } else if (value === '.nan') {
	    return NaN;
	  } else if (value.indexOf(':') >= 0) {
	    value.split(':').forEach(function (v) {
	      digits.unshift(parseFloat(v, 10));
	    });

	    value = 0.0;
	    base = 1;

	    digits.forEach(function (d) {
	      value += d * base;
	      base *= 60;
	    });

	    return sign * value;
	  }
	  return sign * parseFloat(value, 10);
	}

	var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

	function representYamlFloat(object, style) {
	  var res;

	  if (isNaN(object)) {
	    switch (style) {
	      case 'lowercase':
	        return '.nan';
	      case 'uppercase':
	        return '.NAN';
	      case 'camelcase':
	        return '.NaN';
	    }
	  } else if (Number.POSITIVE_INFINITY === object) {
	    switch (style) {
	      case 'lowercase':
	        return '.inf';
	      case 'uppercase':
	        return '.INF';
	      case 'camelcase':
	        return '.Inf';
	    }
	  } else if (Number.NEGATIVE_INFINITY === object) {
	    switch (style) {
	      case 'lowercase':
	        return '-.inf';
	      case 'uppercase':
	        return '-.INF';
	      case 'camelcase':
	        return '-.Inf';
	    }
	  } else if (common.isNegativeZero(object)) {
	    return '-0.0';
	  }

	  res = object.toString(10);

	  // JS stringifier can build scientific format without dots: 5e-100,
	  // while YAML requres dot: 5.e-100. Fix it with simple hack

	  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
	}

	function isFloat(object) {
	  return Object.prototype.toString.call(object) === '[object Number]' && (object % 1 !== 0 || common.isNegativeZero(object));
	}

	module.exports = new Type('tag:yaml.org,2002:float', {
	  kind: 'scalar',
	  resolve: resolveYamlFloat,
	  construct: constructYamlFloat,
	  predicate: isFloat,
	  represent: representYamlFloat,
	  defaultStyle: 'lowercase'
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	var YAML_DATE_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' + // [1] year
	'-([0-9][0-9])' + // [2] month
	'-([0-9][0-9])$'); // [3] day

	var YAML_TIMESTAMP_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' + // [1] year
	'-([0-9][0-9]?)' + // [2] month
	'-([0-9][0-9]?)' + // [3] day
	'(?:[Tt]|[ \\t]+)' + // ...
	'([0-9][0-9]?)' + // [4] hour
	':([0-9][0-9])' + // [5] minute
	':([0-9][0-9])' + // [6] second
	'(?:\\.([0-9]*))?' + // [7] fraction
	'(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
	'(?::([0-9][0-9]))?))?$'); // [11] tz_minute

	function resolveYamlTimestamp(data) {
	  if (data === null) return false;
	  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
	  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
	  return false;
	}

	function constructYamlTimestamp(data) {
	  var match,
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      fraction = 0,
	      delta = null,
	      tz_hour,
	      tz_minute,
	      date;

	  match = YAML_DATE_REGEXP.exec(data);
	  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

	  if (match === null) throw new Error('Date resolve error');

	  // match: [1] year [2] month [3] day

	  year = +match[1];
	  month = +match[2] - 1; // JS month starts with 0
	  day = +match[3];

	  if (!match[4]) {
	    // no hour
	    return new Date(Date.UTC(year, month, day));
	  }

	  // match: [4] hour [5] minute [6] second [7] fraction

	  hour = +match[4];
	  minute = +match[5];
	  second = +match[6];

	  if (match[7]) {
	    fraction = match[7].slice(0, 3);
	    while (fraction.length < 3) {
	      // milli-seconds
	      fraction += '0';
	    }
	    fraction = +fraction;
	  }

	  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

	  if (match[9]) {
	    tz_hour = +match[10];
	    tz_minute = +(match[11] || 0);
	    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
	    if (match[9] === '-') delta = -delta;
	  }

	  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

	  if (delta) date.setTime(date.getTime() - delta);

	  return date;
	}

	function representYamlTimestamp(object /*, style*/) {
	  return object.toISOString();
	}

	module.exports = new Type('tag:yaml.org,2002:timestamp', {
	  kind: 'scalar',
	  resolve: resolveYamlTimestamp,
	  construct: constructYamlTimestamp,
	  instanceOf: Date,
	  represent: representYamlTimestamp
	});

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	function resolveYamlMerge(data) {
	  return data === '<<' || data === null;
	}

	module.exports = new Type('tag:yaml.org,2002:merge', {
	  kind: 'scalar',
	  resolve: resolveYamlMerge
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var require;'use strict';

	/*eslint-disable no-bitwise*/

	var NodeBuffer;

	try {
	  // A trick for browserified version, to not include `Buffer` shim
	  var _require = require;
	  NodeBuffer = __webpack_require__(26).Buffer;
	} catch (__) {}

	var Type = __webpack_require__(12);

	// [ 64, 65, 66 ] -> [ padding, CR, LF ]
	var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';

	function resolveYamlBinary(data) {
	  if (data === null) return false;

	  var code,
	      idx,
	      bitlen = 0,
	      max = data.length,
	      map = BASE64_MAP;

	  // Convert one by one.
	  for (idx = 0; idx < max; idx++) {
	    code = map.indexOf(data.charAt(idx));

	    // Skip CR/LF
	    if (code > 64) continue;

	    // Fail on illegal characters
	    if (code < 0) return false;

	    bitlen += 6;
	  }

	  // If there are any bits left, source was corrupted
	  return bitlen % 8 === 0;
	}

	function constructYamlBinary(data) {
	  var idx,
	      tailbits,
	      input = data.replace(/[\r\n=]/g, ''),
	      // remove CR/LF & padding to simplify scan
	  max = input.length,
	      map = BASE64_MAP,
	      bits = 0,
	      result = [];

	  // Collect by 6*4 bits (3 bytes)

	  for (idx = 0; idx < max; idx++) {
	    if (idx % 4 === 0 && idx) {
	      result.push(bits >> 16 & 0xFF);
	      result.push(bits >> 8 & 0xFF);
	      result.push(bits & 0xFF);
	    }

	    bits = bits << 6 | map.indexOf(input.charAt(idx));
	  }

	  // Dump tail

	  tailbits = max % 4 * 6;

	  if (tailbits === 0) {
	    result.push(bits >> 16 & 0xFF);
	    result.push(bits >> 8 & 0xFF);
	    result.push(bits & 0xFF);
	  } else if (tailbits === 18) {
	    result.push(bits >> 10 & 0xFF);
	    result.push(bits >> 2 & 0xFF);
	  } else if (tailbits === 12) {
	    result.push(bits >> 4 & 0xFF);
	  }

	  // Wrap into Buffer for NodeJS and leave Array for browser
	  if (NodeBuffer) return new NodeBuffer(result);

	  return result;
	}

	function representYamlBinary(object /*, style*/) {
	  var result = '',
	      bits = 0,
	      idx,
	      tail,
	      max = object.length,
	      map = BASE64_MAP;

	  // Convert every three bytes to 4 ASCII characters.

	  for (idx = 0; idx < max; idx++) {
	    if (idx % 3 === 0 && idx) {
	      result += map[bits >> 18 & 0x3F];
	      result += map[bits >> 12 & 0x3F];
	      result += map[bits >> 6 & 0x3F];
	      result += map[bits & 0x3F];
	    }

	    bits = (bits << 8) + object[idx];
	  }

	  // Dump tail

	  tail = max % 3;

	  if (tail === 0) {
	    result += map[bits >> 18 & 0x3F];
	    result += map[bits >> 12 & 0x3F];
	    result += map[bits >> 6 & 0x3F];
	    result += map[bits & 0x3F];
	  } else if (tail === 2) {
	    result += map[bits >> 10 & 0x3F];
	    result += map[bits >> 4 & 0x3F];
	    result += map[bits << 2 & 0x3F];
	    result += map[64];
	  } else if (tail === 1) {
	    result += map[bits >> 2 & 0x3F];
	    result += map[bits << 4 & 0x3F];
	    result += map[64];
	    result += map[64];
	  }

	  return result;
	}

	function isBinary(object) {
	  return NodeBuffer && NodeBuffer.isBuffer(object);
	}

	module.exports = new Type('tag:yaml.org,2002:binary', {
	  kind: 'scalar',
	  resolve: resolveYamlBinary,
	  construct: constructYamlBinary,
	  predicate: isBinary,
	  represent: representYamlBinary
	});

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("buffer");

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	var _hasOwnProperty = Object.prototype.hasOwnProperty;
	var _toString = Object.prototype.toString;

	function resolveYamlOmap(data) {
	  if (data === null) return true;

	  var objectKeys = [],
	      index,
	      length,
	      pair,
	      pairKey,
	      pairHasKey,
	      object = data;

	  for (index = 0, length = object.length; index < length; index += 1) {
	    pair = object[index];
	    pairHasKey = false;

	    if (_toString.call(pair) !== '[object Object]') return false;

	    for (pairKey in pair) {
	      if (_hasOwnProperty.call(pair, pairKey)) {
	        if (!pairHasKey) pairHasKey = true;else return false;
	      }
	    }

	    if (!pairHasKey) return false;

	    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);else return false;
	  }

	  return true;
	}

	function constructYamlOmap(data) {
	  return data !== null ? data : [];
	}

	module.exports = new Type('tag:yaml.org,2002:omap', {
	  kind: 'sequence',
	  resolve: resolveYamlOmap,
	  construct: constructYamlOmap
	});

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	var _toString = Object.prototype.toString;

	function resolveYamlPairs(data) {
	  if (data === null) return true;

	  var index,
	      length,
	      pair,
	      keys,
	      result,
	      object = data;

	  result = new Array(object.length);

	  for (index = 0, length = object.length; index < length; index += 1) {
	    pair = object[index];

	    if (_toString.call(pair) !== '[object Object]') return false;

	    keys = Object.keys(pair);

	    if (keys.length !== 1) return false;

	    result[index] = [keys[0], pair[keys[0]]];
	  }

	  return true;
	}

	function constructYamlPairs(data) {
	  if (data === null) return [];

	  var index,
	      length,
	      pair,
	      keys,
	      result,
	      object = data;

	  result = new Array(object.length);

	  for (index = 0, length = object.length; index < length; index += 1) {
	    pair = object[index];

	    keys = Object.keys(pair);

	    result[index] = [keys[0], pair[keys[0]]];
	  }

	  return result;
	}

	module.exports = new Type('tag:yaml.org,2002:pairs', {
	  kind: 'sequence',
	  resolve: resolveYamlPairs,
	  construct: constructYamlPairs
	});

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	var _hasOwnProperty = Object.prototype.hasOwnProperty;

	function resolveYamlSet(data) {
	  if (data === null) return true;

	  var key,
	      object = data;

	  for (key in object) {
	    if (_hasOwnProperty.call(object, key)) {
	      if (object[key] !== null) return false;
	    }
	  }

	  return true;
	}

	function constructYamlSet(data) {
	  return data !== null ? data : {};
	}

	module.exports = new Type('tag:yaml.org,2002:set', {
	  kind: 'mapping',
	  resolve: resolveYamlSet,
	  construct: constructYamlSet
	});

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// JS-YAML's default schema for `load` function.
	// It is not described in the YAML specification.
	//
	// This schema is based on JS-YAML's default safe schema and includes
	// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
	//
	// Also this schema is used as default base schema at `Schema.create` function.


	'use strict';

	var Schema = __webpack_require__(11);

	module.exports = Schema.DEFAULT = new Schema({
	  include: [__webpack_require__(10)],
	  explicit: [__webpack_require__(31), __webpack_require__(32), __webpack_require__(33)]
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	function resolveJavascriptUndefined() {
	  return true;
	}

	function constructJavascriptUndefined() {
	  /*eslint-disable no-undefined*/
	  return undefined;
	}

	function representJavascriptUndefined() {
	  return '';
	}

	function isUndefined(object) {
	  return typeof object === 'undefined';
	}

	module.exports = new Type('tag:yaml.org,2002:js/undefined', {
	  kind: 'scalar',
	  resolve: resolveJavascriptUndefined,
	  construct: constructJavascriptUndefined,
	  predicate: isUndefined,
	  represent: representJavascriptUndefined
	});

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Type = __webpack_require__(12);

	function resolveJavascriptRegExp(data) {
	  if (data === null) return false;
	  if (data.length === 0) return false;

	  var regexp = data,
	      tail = /\/([gim]*)$/.exec(data),
	      modifiers = '';

	  // if regexp starts with '/' it can have modifiers and must be properly closed
	  // `/foo/gim` - modifiers tail can be maximum 3 chars
	  if (regexp[0] === '/') {
	    if (tail) modifiers = tail[1];

	    if (modifiers.length > 3) return false;
	    // if expression starts with /, is should be properly terminated
	    if (regexp[regexp.length - modifiers.length - 1] !== '/') return false;
	  }

	  return true;
	}

	function constructJavascriptRegExp(data) {
	  var regexp = data,
	      tail = /\/([gim]*)$/.exec(data),
	      modifiers = '';

	  // `/foo/gim` - tail can be maximum 4 chars
	  if (regexp[0] === '/') {
	    if (tail) modifiers = tail[1];
	    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
	  }

	  return new RegExp(regexp, modifiers);
	}

	function representJavascriptRegExp(object /*, style*/) {
	  var result = '/' + object.source + '/';

	  if (object.global) result += 'g';
	  if (object.multiline) result += 'm';
	  if (object.ignoreCase) result += 'i';

	  return result;
	}

	function isRegExp(object) {
	  return Object.prototype.toString.call(object) === '[object RegExp]';
	}

	module.exports = new Type('tag:yaml.org,2002:js/regexp', {
	  kind: 'scalar',
	  resolve: resolveJavascriptRegExp,
	  construct: constructJavascriptRegExp,
	  predicate: isRegExp,
	  represent: representJavascriptRegExp
	});

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var require;'use strict';

	var esprima;

	// Browserified version does not have esprima
	//
	// 1. For node.js just require module as deps
	// 2. For browser try to require mudule via external AMD system.
	//    If not found - try to fallback to window.esprima. If not
	//    found too - then fail to parse.
	//
	try {
	  // workaround to exclude package from browserify list.
	  var _require = require;
	  esprima = __webpack_require__(34);
	} catch (_) {
	  /*global window */
	  if (typeof window !== 'undefined') esprima = window.esprima;
	}

	var Type = __webpack_require__(12);

	function resolveJavascriptFunction(data) {
	  if (data === null) return false;

	  try {
	    var source = '(' + data + ')',
	        ast = esprima.parse(source, { range: true });

	    if (ast.type !== 'Program' || ast.body.length !== 1 || ast.body[0].type !== 'ExpressionStatement' || ast.body[0].expression.type !== 'FunctionExpression') {
	      return false;
	    }

	    return true;
	  } catch (err) {
	    return false;
	  }
	}

	function constructJavascriptFunction(data) {
	  /*jslint evil:true*/

	  var source = '(' + data + ')',
	      ast = esprima.parse(source, { range: true }),
	      params = [],
	      body;

	  if (ast.type !== 'Program' || ast.body.length !== 1 || ast.body[0].type !== 'ExpressionStatement' || ast.body[0].expression.type !== 'FunctionExpression') {
	    throw new Error('Failed to resolve function');
	  }

	  ast.body[0].expression.params.forEach(function (param) {
	    params.push(param.name);
	  });

	  body = ast.body[0].expression.body.range;

	  // Esprima's ranges include the first '{' and the last '}' characters on
	  // function expressions. So cut them out.
	  /*eslint-disable no-new-func*/
	  return new Function(params, source.slice(body[0] + 1, body[1] - 1));
	}

	function representJavascriptFunction(object /*, style*/) {
	  return object.toString();
	}

	function isFunction(object) {
	  return Object.prototype.toString.call(object) === '[object Function]';
	}

	module.exports = new Type('tag:yaml.org,2002:js/function', {
	  kind: 'scalar',
	  resolve: resolveJavascriptFunction,
	  construct: constructJavascriptFunction,
	  predicate: isFunction,
	  represent: representJavascriptFunction
	});

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	/*
	  Copyright (c) jQuery Foundation, Inc. and Contributors, All Rights Reserved.

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (root, factory) {
	    'use strict';

	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // Rhino, and plain browser loading.

	    /* istanbul ignore next */

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory(root.esprima = {});
	    }
	})(undefined, function (exports) {
	    'use strict';

	    var Token, TokenName, FnExprTokens, Syntax, PlaceHolders, Messages, Regex, source, strict, index, lineNumber, lineStart, hasLineTerminator, lastIndex, lastLineNumber, lastLineStart, startIndex, startLineNumber, startLineStart, scanning, length, lookahead, state, extra, isBindingElement, isAssignmentTarget, firstCoverInitializedNameError;

	    Token = {
	        BooleanLiteral: 1,
	        EOF: 2,
	        Identifier: 3,
	        Keyword: 4,
	        NullLiteral: 5,
	        NumericLiteral: 6,
	        Punctuator: 7,
	        StringLiteral: 8,
	        RegularExpression: 9,
	        Template: 10
	    };

	    TokenName = {};
	    TokenName[Token.BooleanLiteral] = 'Boolean';
	    TokenName[Token.EOF] = '<end>';
	    TokenName[Token.Identifier] = 'Identifier';
	    TokenName[Token.Keyword] = 'Keyword';
	    TokenName[Token.NullLiteral] = 'Null';
	    TokenName[Token.NumericLiteral] = 'Numeric';
	    TokenName[Token.Punctuator] = 'Punctuator';
	    TokenName[Token.StringLiteral] = 'String';
	    TokenName[Token.RegularExpression] = 'RegularExpression';
	    TokenName[Token.Template] = 'Template';

	    // A function following one of those tokens is an expression.
	    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new', 'return', 'case', 'delete', 'throw', 'void',
	    // assignment operators
	    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^=', ',',
	    // binary/unary operators
	    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&', '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=', '<=', '<', '>', '!=', '!=='];

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        AssignmentPattern: 'AssignmentPattern',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportAllDeclaration: 'ExportAllDeclaration',
	        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
	        ExportNamedDeclaration: 'ExportNamedDeclaration',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForOfStatement: 'ForOfStatement',
	        ForInStatement: 'ForInStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	        ImportSpecifier: 'ImportSpecifier',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MetaProperty: 'MetaProperty',
	        MethodDefinition: 'MethodDefinition',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        RestElement: 'RestElement',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        Super: 'Super',
	        SwitchCase: 'SwitchCase',
	        SwitchStatement: 'SwitchStatement',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	    };

	    PlaceHolders = {
	        ArrowParameterPlaceHolder: 'ArrowParameterPlaceHolder'
	    };

	    // Error messages should be identical to V8.
	    Messages = {
	        UnexpectedToken: 'Unexpected token %0',
	        UnexpectedNumber: 'Unexpected number',
	        UnexpectedString: 'Unexpected string',
	        UnexpectedIdentifier: 'Unexpected identifier',
	        UnexpectedReserved: 'Unexpected reserved word',
	        UnexpectedTemplate: 'Unexpected quasi %0',
	        UnexpectedEOS: 'Unexpected end of input',
	        NewlineAfterThrow: 'Illegal newline after throw',
	        InvalidRegExp: 'Invalid regular expression',
	        UnterminatedRegExp: 'Invalid regular expression: missing /',
	        InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
	        InvalidLHSInForIn: 'Invalid left-hand side in for-in',
	        InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
	        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	        NoCatchOrFinally: 'Missing catch or finally after try',
	        UnknownLabel: 'Undefined label \'%0\'',
	        Redeclaration: '%0 \'%1\' has already been declared',
	        IllegalContinue: 'Illegal continue statement',
	        IllegalBreak: 'Illegal break statement',
	        IllegalReturn: 'Illegal return statement',
	        StrictModeWith: 'Strict mode code may not include a with statement',
	        StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
	        StrictVarName: 'Variable name may not be eval or arguments in strict mode',
	        StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
	        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	        StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
	        StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
	        StrictDelete: 'Delete of an unqualified identifier in strict mode.',
	        StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
	        StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictReservedWord: 'Use of future reserved word in strict mode',
	        TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
	        ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
	        DefaultRestParameter: 'Unexpected token =',
	        ObjectPatternAsRestParameter: 'Unexpected token {',
	        DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
	        ConstructorSpecialMethod: 'Class constructor may not be an accessor',
	        DuplicateConstructor: 'A class may only have one constructor',
	        StaticPrototype: 'Classes may not have static property named prototype',
	        MissingFromClause: 'Unexpected token',
	        NoAsAfterImportNamespace: 'Unexpected token',
	        InvalidModuleSpecifier: 'Unexpected token',
	        IllegalImportDeclaration: 'Unexpected token',
	        IllegalExportDeclaration: 'Unexpected token',
	        DuplicateBinding: 'Duplicate binding %0'
	    };

	    // See also tools/generate-unicode-regex.js.
	    Regex = {
	        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierStart:
	        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,

	        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierPart:
	        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
	    };

	    // Ensure the condition is true, otherwise throw an error.
	    // This is only to have a better contract semantic, i.e. another safety net
	    // to catch a logic error. The condition shall be fulfilled in normal case.
	    // Do NOT use this to enforce a certain condition on any user input.

	    function assert(condition, message) {
	        /* istanbul ignore if */
	        if (!condition) {
	            throw new Error('ASSERT: ' + message);
	        }
	    }

	    function isDecimalDigit(ch) {
	        return ch >= 0x30 && ch <= 0x39; // 0..9
	    }

	    function isHexDigit(ch) {
	        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
	    }

	    function isOctalDigit(ch) {
	        return '01234567'.indexOf(ch) >= 0;
	    }

	    function octalToDecimal(ch) {
	        // \0 is not octal escape sequence
	        var octal = ch !== '0',
	            code = '01234567'.indexOf(ch);

	        if (index < length && isOctalDigit(source[index])) {
	            octal = true;
	            code = code * 8 + '01234567'.indexOf(source[index++]);

	            // 3 digits are only allowed when string starts
	            // with 0, 1, 2, 3
	            if ('0123'.indexOf(ch) >= 0 && index < length && isOctalDigit(source[index])) {
	                code = code * 8 + '01234567'.indexOf(source[index++]);
	            }
	        }

	        return {
	            code: code,
	            octal: octal
	        };
	    }

	    // ECMA-262 11.2 White Space

	    function isWhiteSpace(ch) {
	        return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 || ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0;
	    }

	    // ECMA-262 11.3 Line Terminators

	    function isLineTerminator(ch) {
	        return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
	    }

	    // ECMA-262 11.6 Identifier Names and Identifiers

	    function fromCodePoint(cp) {
	        return cp < 0x10000 ? String.fromCharCode(cp) : String.fromCharCode(0xD800 + (cp - 0x10000 >> 10)) + String.fromCharCode(0xDC00 + (cp - 0x10000 & 1023));
	    }

	    function isIdentifierStart(ch) {
	        return ch === 0x24 || ch === 0x5F || // $ (dollar) and _ (underscore)
	        ch >= 0x41 && ch <= 0x5A || // A..Z
	        ch >= 0x61 && ch <= 0x7A || // a..z
	        ch === 0x5C || // \ (backslash)
	        ch >= 0x80 && Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
	    }

	    function isIdentifierPart(ch) {
	        return ch === 0x24 || ch === 0x5F || // $ (dollar) and _ (underscore)
	        ch >= 0x41 && ch <= 0x5A || // A..Z
	        ch >= 0x61 && ch <= 0x7A || // a..z
	        ch >= 0x30 && ch <= 0x39 || // 0..9
	        ch === 0x5C || // \ (backslash)
	        ch >= 0x80 && Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
	    }

	    // ECMA-262 11.6.2.2 Future Reserved Words

	    function isFutureReservedWord(id) {
	        switch (id) {
	            case 'enum':
	            case 'export':
	            case 'import':
	            case 'super':
	                return true;
	            default:
	                return false;
	        }
	    }

	    function isStrictModeReservedWord(id) {
	        switch (id) {
	            case 'implements':
	            case 'interface':
	            case 'package':
	            case 'private':
	            case 'protected':
	            case 'public':
	            case 'static':
	            case 'yield':
	            case 'let':
	                return true;
	            default:
	                return false;
	        }
	    }

	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }

	    // ECMA-262 11.6.2.1 Keywords

	    function isKeyword(id) {
	        switch (id.length) {
	            case 2:
	                return id === 'if' || id === 'in' || id === 'do';
	            case 3:
	                return id === 'var' || id === 'for' || id === 'new' || id === 'try' || id === 'let';
	            case 4:
	                return id === 'this' || id === 'else' || id === 'case' || id === 'void' || id === 'with' || id === 'enum';
	            case 5:
	                return id === 'while' || id === 'break' || id === 'catch' || id === 'throw' || id === 'const' || id === 'yield' || id === 'class' || id === 'super';
	            case 6:
	                return id === 'return' || id === 'typeof' || id === 'delete' || id === 'switch' || id === 'export' || id === 'import';
	            case 7:
	                return id === 'default' || id === 'finally' || id === 'extends';
	            case 8:
	                return id === 'function' || id === 'continue' || id === 'debugger';
	            case 10:
	                return id === 'instanceof';
	            default:
	                return false;
	        }
	    }

	    // ECMA-262 11.4 Comments

	    function addComment(type, value, start, end, loc) {
	        var comment;

	        assert(typeof start === 'number', 'Comment must have valid position');

	        state.lastCommentStart = start;

	        comment = {
	            type: type,
	            value: value
	        };
	        if (extra.range) {
	            comment.range = [start, end];
	        }
	        if (extra.loc) {
	            comment.loc = loc;
	        }
	        extra.comments.push(comment);
	        if (extra.attachComment) {
	            extra.leadingComments.push(comment);
	            extra.trailingComments.push(comment);
	        }
	        if (extra.tokenize) {
	            comment.type = comment.type + 'Comment';
	            if (extra.delegate) {
	                comment = extra.delegate(comment);
	            }
	            extra.tokens.push(comment);
	        }
	    }

	    function skipSingleLineComment(offset) {
	        var start, loc, ch, comment;

	        start = index - offset;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart - offset
	            }
	        };

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            ++index;
	            if (isLineTerminator(ch)) {
	                hasLineTerminator = true;
	                if (extra.comments) {
	                    comment = source.slice(start + offset, index - 1);
	                    loc.end = {
	                        line: lineNumber,
	                        column: index - lineStart - 1
	                    };
	                    addComment('Line', comment, start, index - 1, loc);
	                }
	                if (ch === 13 && source.charCodeAt(index) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	                return;
	            }
	        }

	        if (extra.comments) {
	            comment = source.slice(start + offset, index);
	            loc.end = {
	                line: lineNumber,
	                column: index - lineStart
	            };
	            addComment('Line', comment, start, index, loc);
	        }
	    }

	    function skipMultiLineComment() {
	        var start, loc, ch, comment;

	        if (extra.comments) {
	            start = index - 2;
	            loc = {
	                start: {
	                    line: lineNumber,
	                    column: index - lineStart - 2
	                }
	            };
	        }

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (isLineTerminator(ch)) {
	                if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
	                    ++index;
	                }
	                hasLineTerminator = true;
	                ++lineNumber;
	                ++index;
	                lineStart = index;
	            } else if (ch === 0x2A) {
	                // Block comment ends with '*/'.
	                if (source.charCodeAt(index + 1) === 0x2F) {
	                    ++index;
	                    ++index;
	                    if (extra.comments) {
	                        comment = source.slice(start + 2, index - 2);
	                        loc.end = {
	                            line: lineNumber,
	                            column: index - lineStart
	                        };
	                        addComment('Block', comment, start, index, loc);
	                    }
	                    return;
	                }
	                ++index;
	            } else {
	                ++index;
	            }
	        }

	        // Ran off the end of the file - the whole thing is a comment
	        if (extra.comments) {
	            loc.end = {
	                line: lineNumber,
	                column: index - lineStart
	            };
	            comment = source.slice(start + 2, index);
	            addComment('Block', comment, start, index, loc);
	        }
	        tolerateUnexpectedToken();
	    }

	    function skipComment() {
	        var ch, start;
	        hasLineTerminator = false;

	        start = index === 0;
	        while (index < length) {
	            ch = source.charCodeAt(index);

	            if (isWhiteSpace(ch)) {
	                ++index;
	            } else if (isLineTerminator(ch)) {
	                hasLineTerminator = true;
	                ++index;
	                if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	                start = true;
	            } else if (ch === 0x2F) {
	                // U+002F is '/'
	                ch = source.charCodeAt(index + 1);
	                if (ch === 0x2F) {
	                    ++index;
	                    ++index;
	                    skipSingleLineComment(2);
	                    start = true;
	                } else if (ch === 0x2A) {
	                    // U+002A is '*'
	                    ++index;
	                    ++index;
	                    skipMultiLineComment();
	                } else {
	                    break;
	                }
	            } else if (start && ch === 0x2D) {
	                // U+002D is '-'
	                // U+003E is '>'
	                if (source.charCodeAt(index + 1) === 0x2D && source.charCodeAt(index + 2) === 0x3E) {
	                    // '-->' is a single-line comment
	                    index += 3;
	                    skipSingleLineComment(3);
	                } else {
	                    break;
	                }
	            } else if (ch === 0x3C) {
	                // U+003C is '<'
	                if (source.slice(index + 1, index + 4) === '!--') {
	                    ++index; // `<`
	                    ++index; // `!`
	                    ++index; // `-`
	                    ++index; // `-`
	                    skipSingleLineComment(4);
	                } else {
	                    break;
	                }
	            } else {
	                break;
	            }
	        }
	    }

	    function scanHexEscape(prefix) {
	        var i,
	            len,
	            ch,
	            code = 0;

	        len = prefix === 'u' ? 4 : 2;
	        for (i = 0; i < len; ++i) {
	            if (index < length && isHexDigit(source[index])) {
	                ch = source[index++];
	                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	            } else {
	                return '';
	            }
	        }
	        return String.fromCharCode(code);
	    }

	    function scanUnicodeCodePointEscape() {
	        var ch, code;

	        ch = source[index];
	        code = 0;

	        // At least, one hex digit is required.
	        if (ch === '}') {
	            throwUnexpectedToken();
	        }

	        while (index < length) {
	            ch = source[index++];
	            if (!isHexDigit(ch)) {
	                break;
	            }
	            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	        }

	        if (code > 0x10FFFF || ch !== '}') {
	            throwUnexpectedToken();
	        }

	        return fromCodePoint(code);
	    }

	    function codePointAt(i) {
	        var cp, first, second;

	        cp = source.charCodeAt(i);
	        if (cp >= 0xD800 && cp <= 0xDBFF) {
	            second = source.charCodeAt(i + 1);
	            if (second >= 0xDC00 && second <= 0xDFFF) {
	                first = cp;
	                cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
	            }
	        }

	        return cp;
	    }

	    function getComplexIdentifier() {
	        var cp, ch, id;

	        cp = codePointAt(index);
	        id = fromCodePoint(cp);
	        index += id.length;

	        // '\u' (U+005C, U+0075) denotes an escaped character.
	        if (cp === 0x5C) {
	            if (source.charCodeAt(index) !== 0x75) {
	                throwUnexpectedToken();
	            }
	            ++index;
	            if (source[index] === '{') {
	                ++index;
	                ch = scanUnicodeCodePointEscape();
	            } else {
	                ch = scanHexEscape('u');
	                cp = ch.charCodeAt(0);
	                if (!ch || ch === '\\' || !isIdentifierStart(cp)) {
	                    throwUnexpectedToken();
	                }
	            }
	            id = ch;
	        }

	        while (index < length) {
	            cp = codePointAt(index);
	            if (!isIdentifierPart(cp)) {
	                break;
	            }
	            ch = fromCodePoint(cp);
	            id += ch;
	            index += ch.length;

	            // '\u' (U+005C, U+0075) denotes an escaped character.
	            if (cp === 0x5C) {
	                id = id.substr(0, id.length - 1);
	                if (source.charCodeAt(index) !== 0x75) {
	                    throwUnexpectedToken();
	                }
	                ++index;
	                if (source[index] === '{') {
	                    ++index;
	                    ch = scanUnicodeCodePointEscape();
	                } else {
	                    ch = scanHexEscape('u');
	                    cp = ch.charCodeAt(0);
	                    if (!ch || ch === '\\' || !isIdentifierPart(cp)) {
	                        throwUnexpectedToken();
	                    }
	                }
	                id += ch;
	            }
	        }

	        return id;
	    }

	    function getIdentifier() {
	        var start, ch;

	        start = index++;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (ch === 0x5C) {
	                // Blackslash (U+005C) marks Unicode escape sequence.
	                index = start;
	                return getComplexIdentifier();
	            } else if (ch >= 0xD800 && ch < 0xDFFF) {
	                // Need to handle surrogate pairs.
	                index = start;
	                return getComplexIdentifier();
	            }
	            if (isIdentifierPart(ch)) {
	                ++index;
	            } else {
	                break;
	            }
	        }

	        return source.slice(start, index);
	    }

	    function scanIdentifier() {
	        var start, id, type;

	        start = index;

	        // Backslash (U+005C) starts an escaped character.
	        id = source.charCodeAt(index) === 0x5C ? getComplexIdentifier() : getIdentifier();

	        // There is no keyword or literal with only one character.
	        // Thus, it must be an identifier.
	        if (id.length === 1) {
	            type = Token.Identifier;
	        } else if (isKeyword(id)) {
	            type = Token.Keyword;
	        } else if (id === 'null') {
	            type = Token.NullLiteral;
	        } else if (id === 'true' || id === 'false') {
	            type = Token.BooleanLiteral;
	        } else {
	            type = Token.Identifier;
	        }

	        return {
	            type: type,
	            value: id,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }

	    // ECMA-262 11.7 Punctuators

	    function scanPunctuator() {
	        var token, str;

	        token = {
	            type: Token.Punctuator,
	            value: '',
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: index,
	            end: index
	        };

	        // Check for most common single-character punctuators.
	        str = source[index];
	        switch (str) {

	            case '(':
	                if (extra.tokenize) {
	                    extra.openParenToken = extra.tokenValues.length;
	                }
	                ++index;
	                break;

	            case '{':
	                if (extra.tokenize) {
	                    extra.openCurlyToken = extra.tokenValues.length;
	                }
	                state.curlyStack.push('{');
	                ++index;
	                break;

	            case '.':
	                ++index;
	                if (source[index] === '.' && source[index + 1] === '.') {
	                    // Spread operator: ...
	                    index += 2;
	                    str = '...';
	                }
	                break;

	            case '}':
	                ++index;
	                state.curlyStack.pop();
	                break;
	            case ')':
	            case ';':
	            case ',':
	            case '[':
	            case ']':
	            case ':':
	            case '?':
	            case '~':
	                ++index;
	                break;

	            default:
	                // 4-character punctuator.
	                str = source.substr(index, 4);
	                if (str === '>>>=') {
	                    index += 4;
	                } else {

	                    // 3-character punctuators.
	                    str = str.substr(0, 3);
	                    if (str === '===' || str === '!==' || str === '>>>' || str === '<<=' || str === '>>=') {
	                        index += 3;
	                    } else {

	                        // 2-character punctuators.
	                        str = str.substr(0, 2);
	                        if (str === '&&' || str === '||' || str === '==' || str === '!=' || str === '+=' || str === '-=' || str === '*=' || str === '/=' || str === '++' || str === '--' || str === '<<' || str === '>>' || str === '&=' || str === '|=' || str === '^=' || str === '%=' || str === '<=' || str === '>=' || str === '=>') {
	                            index += 2;
	                        } else {

	                            // 1-character punctuators.
	                            str = source[index];
	                            if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
	                                ++index;
	                            }
	                        }
	                    }
	                }
	        }

	        if (index === token.start) {
	            throwUnexpectedToken();
	        }

	        token.end = index;
	        token.value = str;
	        return token;
	    }

	    // ECMA-262 11.8.3 Numeric Literals

	    function scanHexLiteral(start) {
	        var number = '';

	        while (index < length) {
	            if (!isHexDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (number.length === 0) {
	            throwUnexpectedToken();
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwUnexpectedToken();
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt('0x' + number, 16),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }

	    function scanBinaryLiteral(start) {
	        var ch, number;

	        number = '';

	        while (index < length) {
	            ch = source[index];
	            if (ch !== '0' && ch !== '1') {
	                break;
	            }
	            number += source[index++];
	        }

	        if (number.length === 0) {
	            // only 0b or 0B
	            throwUnexpectedToken();
	        }

	        if (index < length) {
	            ch = source.charCodeAt(index);
	            /* istanbul ignore else */
	            if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
	                throwUnexpectedToken();
	            }
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 2),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }

	    function scanOctalLiteral(prefix, start) {
	        var number, octal;

	        if (isOctalDigit(prefix)) {
	            octal = true;
	            number = '0' + source[index++];
	        } else {
	            octal = false;
	            ++index;
	            number = '';
	        }

	        while (index < length) {
	            if (!isOctalDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (!octal && number.length === 0) {
	            // only 0o or 0O
	            throwUnexpectedToken();
	        }

	        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
	            throwUnexpectedToken();
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 8),
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }

	    function isImplicitOctalLiteral() {
	        var i, ch;

	        // Implicit octal, unless there is a non-octal digit.
	        // (Annex B.1.1 on Numeric Literals)
	        for (i = index + 1; i < length; ++i) {
	            ch = source[i];
	            if (ch === '8' || ch === '9') {
	                return false;
	            }
	            if (!isOctalDigit(ch)) {
	                return true;
	            }
	        }

	        return true;
	    }

	    function scanNumericLiteral() {
	        var number, start, ch;

	        ch = source[index];
	        assert(isDecimalDigit(ch.charCodeAt(0)) || ch === '.', 'Numeric literal must start with a decimal digit or a decimal point');

	        start = index;
	        number = '';
	        if (ch !== '.') {
	            number = source[index++];
	            ch = source[index];

	            // Hex number starts with '0x'.
	            // Octal number starts with '0'.
	            // Octal number in ES6 starts with '0o'.
	            // Binary number in ES6 starts with '0b'.
	            if (number === '0') {
	                if (ch === 'x' || ch === 'X') {
	                    ++index;
	                    return scanHexLiteral(start);
	                }
	                if (ch === 'b' || ch === 'B') {
	                    ++index;
	                    return scanBinaryLiteral(start);
	                }
	                if (ch === 'o' || ch === 'O') {
	                    return scanOctalLiteral(ch, start);
	                }

	                if (isOctalDigit(ch)) {
	                    if (isImplicitOctalLiteral()) {
	                        return scanOctalLiteral(ch, start);
	                    }
	                }
	            }

	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === '.') {
	            number += source[index++];
	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === 'e' || ch === 'E') {
	            number += source[index++];

	            ch = source[index];
	            if (ch === '+' || ch === '-') {
	                number += source[index++];
	            }
	            if (isDecimalDigit(source.charCodeAt(index))) {
	                while (isDecimalDigit(source.charCodeAt(index))) {
	                    number += source[index++];
	                }
	            } else {
	                throwUnexpectedToken();
	            }
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwUnexpectedToken();
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseFloat(number),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }

	    // ECMA-262 11.8.4 String Literals

	    function scanStringLiteral() {
	        var str = '',
	            quote,
	            start,
	            ch,
	            unescaped,
	            octToDec,
	            octal = false;

	        quote = source[index];
	        assert(quote === '\'' || quote === '"', 'String literal must starts with a quote');

	        start = index;
	        ++index;

	        while (index < length) {
	            ch = source[index++];

	            if (ch === quote) {
	                quote = '';
	                break;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                        case 'u':
	                        case 'x':
	                            if (source[index] === '{') {
	                                ++index;
	                                str += scanUnicodeCodePointEscape();
	                            } else {
	                                unescaped = scanHexEscape(ch);
	                                if (!unescaped) {
	                                    throw throwUnexpectedToken();
	                                }
	                                str += unescaped;
	                            }
	                            break;
	                        case 'n':
	                            str += '\n';
	                            break;
	                        case 'r':
	                            str += '\r';
	                            break;
	                        case 't':
	                            str += '\t';
	                            break;
	                        case 'b':
	                            str += '\b';
	                            break;
	                        case 'f':
	                            str += '\f';
	                            break;
	                        case 'v':
	                            str += '\x0B';
	                            break;
	                        case '8':
	                        case '9':
	                            str += ch;
	                            tolerateUnexpectedToken();
	                            break;

	                        default:
	                            if (isOctalDigit(ch)) {
	                                octToDec = octalToDecimal(ch);

	                                octal = octToDec.octal || octal;
	                                str += String.fromCharCode(octToDec.code);
	                            } else {
	                                str += ch;
	                            }
	                            break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch === '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                break;
	            } else {
	                str += ch;
	            }
	        }

	        if (quote !== '') {
	            index = start;
	            throwUnexpectedToken();
	        }

	        return {
	            type: Token.StringLiteral,
	            value: str,
	            octal: octal,
	            lineNumber: startLineNumber,
	            lineStart: startLineStart,
	            start: start,
	            end: index
	        };
	    }

	    // ECMA-262 11.8.6 Template Literal Lexical Components

	    function scanTemplate() {
	        var cooked = '',
	            ch,
	            start,
	            rawOffset,
	            terminated,
	            head,
	            tail,
	            restore,
	            unescaped;

	        terminated = false;
	        tail = false;
	        start = index;
	        head = source[index] === '`';
	        rawOffset = 2;

	        ++index;

	        while (index < length) {
	            ch = source[index++];
	            if (ch === '`') {
	                rawOffset = 1;
	                tail = true;
	                terminated = true;
	                break;
	            } else if (ch === '$') {
	                if (source[index] === '{') {
	                    state.curlyStack.push('${');
	                    ++index;
	                    terminated = true;
	                    break;
	                }
	                cooked += ch;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                        case 'n':
	                            cooked += '\n';
	                            break;
	                        case 'r':
	                            cooked += '\r';
	                            break;
	                        case 't':
	                            cooked += '\t';
	                            break;
	                        case 'u':
	                        case 'x':
	                            if (source[index] === '{') {
	                                ++index;
	                                cooked += scanUnicodeCodePointEscape();
	                            } else {
	                                restore = index;
	                                unescaped = scanHexEscape(ch);
	                                if (unescaped) {
	                                    cooked += unescaped;
	                                } else {
	                                    index = restore;
	                                    cooked += ch;
	                                }
	                            }
	                            break;
	                        case 'b':
	                            cooked += '\b';
	                            break;
	                        case 'f':
	                            cooked += '\f';
	                            break;
	                        case 'v':
	                            cooked += '\v';
	                            break;

	                        default:
	                            if (ch === '0') {
	                                if (isDecimalDigit(source.charCodeAt(index))) {
	                                    // Illegal: \01 \02 and so on
	                                    throwError(Messages.TemplateOctalLiteral);
	                                }
	                                cooked += '\0';
	                            } else if (isOctalDigit(ch)) {
	                                // Illegal: \1 \2
	                                throwError(Messages.TemplateOctalLiteral);
	                            } else {
	                                cooked += ch;
	                            }
	                            break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch === '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                ++lineNumber;
	                if (ch === '\r' && source[index] === '\n') {
	                    ++index;
	                }
	                lineStart = index;
	                cooked += '\n';
	            } else {
	                cooked += ch;
	            }
	        }

	        if (!terminated) {
	            throwUnexpectedToken();
	        }

	        if (!head) {
	            state.curlyStack.pop();
	        }

	        return {
	            type: Token.Template,
	            value: {
	                cooked: cooked,
	                raw: source.slice(start + 1, index - rawOffset)
	            },
	            head: head,
	            tail: tail,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }

	    // ECMA-262 11.8.5 Regular Expression Literals

	    function testRegExp(pattern, flags) {
	        // The BMP character to use as a replacement for astral symbols when
	        // translating an ES6 "u"-flagged pattern to an ES5-compatible
	        // approximation.
	        // Note: replacing with '\uFFFF' enables false positives in unlikely
	        // scenarios. For example, `[\u{1044f}-\u{10440}]` is an invalid
	        // pattern that would not be detected by this substitution.
	        var astralSubstitute = '\uFFFF',
	            tmp = pattern;

	        if (flags.indexOf('u') >= 0) {
	            tmp = tmp
	            // Replace every Unicode escape sequence with the equivalent
	            // BMP character or a constant ASCII code point in the case of
	            // astral symbols. (See the above note on `astralSubstitute`
	            // for more information.)
	            .replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, function ($0, $1, $2) {
	                var codePoint = parseInt($1 || $2, 16);
	                if (codePoint > 0x10FFFF) {
	                    throwUnexpectedToken(null, Messages.InvalidRegExp);
	                }
	                if (codePoint <= 0xFFFF) {
	                    return String.fromCharCode(codePoint);
	                }
	                return astralSubstitute;
	            })
	            // Replace each paired surrogate with a single ASCII symbol to
	            // avoid throwing on regular expressions that are only valid in
	            // combination with the "u" flag.
	            .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, astralSubstitute);
	        }

	        // First, detect invalid regular expressions.
	        try {
	            RegExp(tmp);
	        } catch (e) {
	            throwUnexpectedToken(null, Messages.InvalidRegExp);
	        }

	        // Return a regular expression object for this pattern-flag pair, or
	        // `null` in case the current environment doesn't support the flags it
	        // uses.
	        try {
	            return new RegExp(pattern, flags);
	        } catch (exception) {
	            /* istanbul ignore next */
	            return null;
	        }
	    }

	    function scanRegExpBody() {
	        var ch, str, classMarker, terminated, body;

	        ch = source[index];
	        assert(ch === '/', 'Regular expression literal must start with a slash');
	        str = source[index++];

	        classMarker = false;
	        terminated = false;
	        while (index < length) {
	            ch = source[index++];
	            str += ch;
	            if (ch === '\\') {
	                ch = source[index++];
	                // ECMA-262 7.8.5
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    throwUnexpectedToken(null, Messages.UnterminatedRegExp);
	                }
	                str += ch;
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                throwUnexpectedToken(null, Messages.UnterminatedRegExp);
	            } else if (classMarker) {
	                if (ch === ']') {
	                    classMarker = false;
	                }
	            } else {
	                if (ch === '/') {
	                    terminated = true;
	                    break;
	                } else if (ch === '[') {
	                    classMarker = true;
	                }
	            }
	        }

	        if (!terminated) {
	            throwUnexpectedToken(null, Messages.UnterminatedRegExp);
	        }

	        // Exclude leading and trailing slash.
	        body = str.substr(1, str.length - 2);
	        return {
	            value: body,
	            literal: str
	        };
	    }

	    function scanRegExpFlags() {
	        var ch, str, flags, restore;

	        str = '';
	        flags = '';
	        while (index < length) {
	            ch = source[index];
	            if (!isIdentifierPart(ch.charCodeAt(0))) {
	                break;
	            }

	            ++index;
	            if (ch === '\\' && index < length) {
	                ch = source[index];
	                if (ch === 'u') {
	                    ++index;
	                    restore = index;
	                    ch = scanHexEscape('u');
	                    if (ch) {
	                        flags += ch;
	                        for (str += '\\u'; restore < index; ++restore) {
	                            str += source[restore];
	                        }
	                    } else {
	                        index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                    tolerateUnexpectedToken();
	                } else {
	                    str += '\\';
	                    tolerateUnexpectedToken();
	                }
	            } else {
	                flags += ch;
	                str += ch;
	            }
	        }

	        return {
	            value: flags,
	            literal: str
	        };
	    }

	    function scanRegExp() {
	        var start, body, flags, value;
	        scanning = true;

	        lookahead = null;
	        skipComment();
	        start = index;

	        body = scanRegExpBody();
	        flags = scanRegExpFlags();
	        value = testRegExp(body.value, flags.value);
	        scanning = false;
	        if (extra.tokenize) {
	            return {
	                type: Token.RegularExpression,
	                value: value,
	                regex: {
	                    pattern: body.value,
	                    flags: flags.value
	                },
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: start,
	                end: index
	            };
	        }

	        return {
	            literal: body.literal + flags.literal,
	            value: value,
	            regex: {
	                pattern: body.value,
	                flags: flags.value
	            },
	            start: start,
	            end: index
	        };
	    }

	    function collectRegex() {
	        var pos, loc, regex, token;

	        skipComment();

	        pos = index;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        regex = scanRegExp();

	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        /* istanbul ignore next */
	        if (!extra.tokenize) {
	            // Pop the previous token, which is likely '/' or '/='
	            if (extra.tokens.length > 0) {
	                token = extra.tokens[extra.tokens.length - 1];
	                if (token.range[0] === pos && token.type === 'Punctuator') {
	                    if (token.value === '/' || token.value === '/=') {
	                        extra.tokens.pop();
	                    }
	                }
	            }

	            extra.tokens.push({
	                type: 'RegularExpression',
	                value: regex.literal,
	                regex: regex.regex,
	                range: [pos, index],
	                loc: loc
	            });
	        }

	        return regex;
	    }

	    function isIdentifierName(token) {
	        return token.type === Token.Identifier || token.type === Token.Keyword || token.type === Token.BooleanLiteral || token.type === Token.NullLiteral;
	    }

	    // Using the following algorithm:
	    // https://github.com/mozilla/sweet.js/wiki/design

	    function advanceSlash() {
	        var regex, previous, check;

	        function testKeyword(value) {
	            return value && value.length > 1 && value[0] >= 'a' && value[0] <= 'z';
	        }

	        previous = extra.tokenValues[extra.tokenValues.length - 1];
	        regex = previous !== null;

	        switch (previous) {
	            case 'this':
	            case ']':
	                regex = false;
	                break;

	            case ')':
	                check = extra.tokenValues[extra.openParenToken - 1];
	                regex = check === 'if' || check === 'while' || check === 'for' || check === 'with';
	                break;

	            case '}':
	                // Dividing a function by anything makes little sense,
	                // but we have to check for that.
	                regex = false;
	                if (testKeyword(extra.tokenValues[extra.openCurlyToken - 3])) {
	                    // Anonymous function, e.g. function(){} /42
	                    check = extra.tokenValues[extra.openCurlyToken - 4];
	                    regex = check ? FnExprTokens.indexOf(check) < 0 : false;
	                } else if (testKeyword(extra.tokenValues[extra.openCurlyToken - 4])) {
	                    // Named function, e.g. function f(){} /42/
	                    check = extra.tokenValues[extra.openCurlyToken - 5];
	                    regex = check ? FnExprTokens.indexOf(check) < 0 : true;
	                }
	        }

	        return regex ? collectRegex() : scanPunctuator();
	    }

	    function advance() {
	        var cp, token;

	        if (index >= length) {
	            return {
	                type: Token.EOF,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: index,
	                end: index
	            };
	        }

	        cp = source.charCodeAt(index);

	        if (isIdentifierStart(cp)) {
	            token = scanIdentifier();
	            if (strict && isStrictModeReservedWord(token.value)) {
	                token.type = Token.Keyword;
	            }
	            return token;
	        }

	        // Very common: ( and ) and ;
	        if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
	            return scanPunctuator();
	        }

	        // String literal starts with single quote (U+0027) or double quote (U+0022).
	        if (cp === 0x27 || cp === 0x22) {
	            return scanStringLiteral();
	        }

	        // Dot (.) U+002E can also start a floating-point number, hence the need
	        // to check the next character.
	        if (cp === 0x2E) {
	            if (isDecimalDigit(source.charCodeAt(index + 1))) {
	                return scanNumericLiteral();
	            }
	            return scanPunctuator();
	        }

	        if (isDecimalDigit(cp)) {
	            return scanNumericLiteral();
	        }

	        // Slash (/) U+002F can also start a regex.
	        if (extra.tokenize && cp === 0x2F) {
	            return advanceSlash();
	        }

	        // Template literals start with ` (U+0060) for template head
	        // or } (U+007D) for template middle or template tail.
	        if (cp === 0x60 || cp === 0x7D && state.curlyStack[state.curlyStack.length - 1] === '${') {
	            return scanTemplate();
	        }

	        // Possible identifier start in a surrogate pair.
	        if (cp >= 0xD800 && cp < 0xDFFF) {
	            cp = codePointAt(index);
	            if (isIdentifierStart(cp)) {
	                return scanIdentifier();
	            }
	        }

	        return scanPunctuator();
	    }

	    function collectToken() {
	        var loc, token, value, entry;

	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        token = advance();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (token.type !== Token.EOF) {
	            value = source.slice(token.start, token.end);
	            entry = {
	                type: TokenName[token.type],
	                value: value,
	                range: [token.start, token.end],
	                loc: loc
	            };
	            if (token.regex) {
	                entry.regex = {
	                    pattern: token.regex.pattern,
	                    flags: token.regex.flags
	                };
	            }
	            if (extra.tokenValues) {
	                extra.tokenValues.push(entry.type === 'Punctuator' || entry.type === 'Keyword' ? entry.value : null);
	            }
	            if (extra.tokenize) {
	                if (!extra.range) {
	                    delete entry.range;
	                }
	                if (!extra.loc) {
	                    delete entry.loc;
	                }
	                if (extra.delegate) {
	                    entry = extra.delegate(entry);
	                }
	            }
	            extra.tokens.push(entry);
	        }

	        return token;
	    }

	    function lex() {
	        var token;
	        scanning = true;

	        lastIndex = index;
	        lastLineNumber = lineNumber;
	        lastLineStart = lineStart;

	        skipComment();

	        token = lookahead;

	        startIndex = index;
	        startLineNumber = lineNumber;
	        startLineStart = lineStart;

	        lookahead = typeof extra.tokens !== 'undefined' ? collectToken() : advance();
	        scanning = false;
	        return token;
	    }

	    function peek() {
	        scanning = true;

	        skipComment();

	        lastIndex = index;
	        lastLineNumber = lineNumber;
	        lastLineStart = lineStart;

	        startIndex = index;
	        startLineNumber = lineNumber;
	        startLineStart = lineStart;

	        lookahead = typeof extra.tokens !== 'undefined' ? collectToken() : advance();
	        scanning = false;
	    }

	    function Position() {
	        this.line = startLineNumber;
	        this.column = startIndex - startLineStart;
	    }

	    function SourceLocation() {
	        this.start = new Position();
	        this.end = null;
	    }

	    function WrappingSourceLocation(startToken) {
	        this.start = {
	            line: startToken.lineNumber,
	            column: startToken.start - startToken.lineStart
	        };
	        this.end = null;
	    }

	    function Node() {
	        if (extra.range) {
	            this.range = [startIndex, 0];
	        }
	        if (extra.loc) {
	            this.loc = new SourceLocation();
	        }
	    }

	    function WrappingNode(startToken) {
	        if (extra.range) {
	            this.range = [startToken.start, 0];
	        }
	        if (extra.loc) {
	            this.loc = new WrappingSourceLocation(startToken);
	        }
	    }

	    WrappingNode.prototype = Node.prototype = {

	        processComment: function processComment() {
	            var lastChild,
	                innerComments,
	                leadingComments,
	                trailingComments,
	                bottomRight = extra.bottomRightStack,
	                i,
	                comment,
	                last = bottomRight[bottomRight.length - 1];

	            if (this.type === Syntax.Program) {
	                if (this.body.length > 0) {
	                    return;
	                }
	            }
	            /**
	             * patch innnerComments for properties empty block
	             * `function a() {/** comments **\/}`
	             */

	            if (this.type === Syntax.BlockStatement && this.body.length === 0) {
	                innerComments = [];
	                for (i = extra.leadingComments.length - 1; i >= 0; --i) {
	                    comment = extra.leadingComments[i];
	                    if (this.range[1] >= comment.range[1]) {
	                        innerComments.unshift(comment);
	                        extra.leadingComments.splice(i, 1);
	                        extra.trailingComments.splice(i, 1);
	                    }
	                }
	                if (innerComments.length) {
	                    this.innerComments = innerComments;
	                    //bottomRight.push(this);
	                    return;
	                }
	            }

	            if (extra.trailingComments.length > 0) {
	                trailingComments = [];
	                for (i = extra.trailingComments.length - 1; i >= 0; --i) {
	                    comment = extra.trailingComments[i];
	                    if (comment.range[0] >= this.range[1]) {
	                        trailingComments.unshift(comment);
	                        extra.trailingComments.splice(i, 1);
	                    }
	                }
	                extra.trailingComments = [];
	            } else {
	                if (last && last.trailingComments && last.trailingComments[0].range[0] >= this.range[1]) {
	                    trailingComments = last.trailingComments;
	                    delete last.trailingComments;
	                }
	            }

	            // Eating the stack.
	            while (last && last.range[0] >= this.range[0]) {
	                lastChild = bottomRight.pop();
	                last = bottomRight[bottomRight.length - 1];
	            }

	            if (lastChild) {
	                if (lastChild.leadingComments) {
	                    leadingComments = [];
	                    for (i = lastChild.leadingComments.length - 1; i >= 0; --i) {
	                        comment = lastChild.leadingComments[i];
	                        if (comment.range[1] <= this.range[0]) {
	                            leadingComments.unshift(comment);
	                            lastChild.leadingComments.splice(i, 1);
	                        }
	                    }

	                    if (!lastChild.leadingComments.length) {
	                        lastChild.leadingComments = undefined;
	                    }
	                }
	            } else if (extra.leadingComments.length > 0) {
	                leadingComments = [];
	                for (i = extra.leadingComments.length - 1; i >= 0; --i) {
	                    comment = extra.leadingComments[i];
	                    if (comment.range[1] <= this.range[0]) {
	                        leadingComments.unshift(comment);
	                        extra.leadingComments.splice(i, 1);
	                    }
	                }
	            }

	            if (leadingComments && leadingComments.length > 0) {
	                this.leadingComments = leadingComments;
	            }
	            if (trailingComments && trailingComments.length > 0) {
	                this.trailingComments = trailingComments;
	            }

	            bottomRight.push(this);
	        },

	        finish: function finish() {
	            if (extra.range) {
	                this.range[1] = lastIndex;
	            }
	            if (extra.loc) {
	                this.loc.end = {
	                    line: lastLineNumber,
	                    column: lastIndex - lastLineStart
	                };
	                if (extra.source) {
	                    this.loc.source = extra.source;
	                }
	            }

	            if (extra.attachComment) {
	                this.processComment();
	            }
	        },

	        finishArrayExpression: function finishArrayExpression(elements) {
	            this.type = Syntax.ArrayExpression;
	            this.elements = elements;
	            this.finish();
	            return this;
	        },

	        finishArrayPattern: function finishArrayPattern(elements) {
	            this.type = Syntax.ArrayPattern;
	            this.elements = elements;
	            this.finish();
	            return this;
	        },

	        finishArrowFunctionExpression: function finishArrowFunctionExpression(params, defaults, body, expression) {
	            this.type = Syntax.ArrowFunctionExpression;
	            this.id = null;
	            this.params = params;
	            this.defaults = defaults;
	            this.body = body;
	            this.generator = false;
	            this.expression = expression;
	            this.finish();
	            return this;
	        },

	        finishAssignmentExpression: function finishAssignmentExpression(operator, left, right) {
	            this.type = Syntax.AssignmentExpression;
	            this.operator = operator;
	            this.left = left;
	            this.right = right;
	            this.finish();
	            return this;
	        },

	        finishAssignmentPattern: function finishAssignmentPattern(left, right) {
	            this.type = Syntax.AssignmentPattern;
	            this.left = left;
	            this.right = right;
	            this.finish();
	            return this;
	        },

	        finishBinaryExpression: function finishBinaryExpression(operator, left, right) {
	            this.type = operator === '||' || operator === '&&' ? Syntax.LogicalExpression : Syntax.BinaryExpression;
	            this.operator = operator;
	            this.left = left;
	            this.right = right;
	            this.finish();
	            return this;
	        },

	        finishBlockStatement: function finishBlockStatement(body) {
	            this.type = Syntax.BlockStatement;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishBreakStatement: function finishBreakStatement(label) {
	            this.type = Syntax.BreakStatement;
	            this.label = label;
	            this.finish();
	            return this;
	        },

	        finishCallExpression: function finishCallExpression(callee, args) {
	            this.type = Syntax.CallExpression;
	            this.callee = callee;
	            this.arguments = args;
	            this.finish();
	            return this;
	        },

	        finishCatchClause: function finishCatchClause(param, body) {
	            this.type = Syntax.CatchClause;
	            this.param = param;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishClassBody: function finishClassBody(body) {
	            this.type = Syntax.ClassBody;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishClassDeclaration: function finishClassDeclaration(id, superClass, body) {
	            this.type = Syntax.ClassDeclaration;
	            this.id = id;
	            this.superClass = superClass;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishClassExpression: function finishClassExpression(id, superClass, body) {
	            this.type = Syntax.ClassExpression;
	            this.id = id;
	            this.superClass = superClass;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishConditionalExpression: function finishConditionalExpression(test, consequent, alternate) {
	            this.type = Syntax.ConditionalExpression;
	            this.test = test;
	            this.consequent = consequent;
	            this.alternate = alternate;
	            this.finish();
	            return this;
	        },

	        finishContinueStatement: function finishContinueStatement(label) {
	            this.type = Syntax.ContinueStatement;
	            this.label = label;
	            this.finish();
	            return this;
	        },

	        finishDebuggerStatement: function finishDebuggerStatement() {
	            this.type = Syntax.DebuggerStatement;
	            this.finish();
	            return this;
	        },

	        finishDoWhileStatement: function finishDoWhileStatement(body, test) {
	            this.type = Syntax.DoWhileStatement;
	            this.body = body;
	            this.test = test;
	            this.finish();
	            return this;
	        },

	        finishEmptyStatement: function finishEmptyStatement() {
	            this.type = Syntax.EmptyStatement;
	            this.finish();
	            return this;
	        },

	        finishExpressionStatement: function finishExpressionStatement(expression) {
	            this.type = Syntax.ExpressionStatement;
	            this.expression = expression;
	            this.finish();
	            return this;
	        },

	        finishForStatement: function finishForStatement(init, test, update, body) {
	            this.type = Syntax.ForStatement;
	            this.init = init;
	            this.test = test;
	            this.update = update;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishForOfStatement: function finishForOfStatement(left, right, body) {
	            this.type = Syntax.ForOfStatement;
	            this.left = left;
	            this.right = right;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishForInStatement: function finishForInStatement(left, right, body) {
	            this.type = Syntax.ForInStatement;
	            this.left = left;
	            this.right = right;
	            this.body = body;
	            this.each = false;
	            this.finish();
	            return this;
	        },

	        finishFunctionDeclaration: function finishFunctionDeclaration(id, params, defaults, body, generator) {
	            this.type = Syntax.FunctionDeclaration;
	            this.id = id;
	            this.params = params;
	            this.defaults = defaults;
	            this.body = body;
	            this.generator = generator;
	            this.expression = false;
	            this.finish();
	            return this;
	        },

	        finishFunctionExpression: function finishFunctionExpression(id, params, defaults, body, generator) {
	            this.type = Syntax.FunctionExpression;
	            this.id = id;
	            this.params = params;
	            this.defaults = defaults;
	            this.body = body;
	            this.generator = generator;
	            this.expression = false;
	            this.finish();
	            return this;
	        },

	        finishIdentifier: function finishIdentifier(name) {
	            this.type = Syntax.Identifier;
	            this.name = name;
	            this.finish();
	            return this;
	        },

	        finishIfStatement: function finishIfStatement(test, consequent, alternate) {
	            this.type = Syntax.IfStatement;
	            this.test = test;
	            this.consequent = consequent;
	            this.alternate = alternate;
	            this.finish();
	            return this;
	        },

	        finishLabeledStatement: function finishLabeledStatement(label, body) {
	            this.type = Syntax.LabeledStatement;
	            this.label = label;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishLiteral: function finishLiteral(token) {
	            this.type = Syntax.Literal;
	            this.value = token.value;
	            this.raw = source.slice(token.start, token.end);
	            if (token.regex) {
	                this.regex = token.regex;
	            }
	            this.finish();
	            return this;
	        },

	        finishMemberExpression: function finishMemberExpression(accessor, object, property) {
	            this.type = Syntax.MemberExpression;
	            this.computed = accessor === '[';
	            this.object = object;
	            this.property = property;
	            this.finish();
	            return this;
	        },

	        finishMetaProperty: function finishMetaProperty(meta, property) {
	            this.type = Syntax.MetaProperty;
	            this.meta = meta;
	            this.property = property;
	            this.finish();
	            return this;
	        },

	        finishNewExpression: function finishNewExpression(callee, args) {
	            this.type = Syntax.NewExpression;
	            this.callee = callee;
	            this.arguments = args;
	            this.finish();
	            return this;
	        },

	        finishObjectExpression: function finishObjectExpression(properties) {
	            this.type = Syntax.ObjectExpression;
	            this.properties = properties;
	            this.finish();
	            return this;
	        },

	        finishObjectPattern: function finishObjectPattern(properties) {
	            this.type = Syntax.ObjectPattern;
	            this.properties = properties;
	            this.finish();
	            return this;
	        },

	        finishPostfixExpression: function finishPostfixExpression(operator, argument) {
	            this.type = Syntax.UpdateExpression;
	            this.operator = operator;
	            this.argument = argument;
	            this.prefix = false;
	            this.finish();
	            return this;
	        },

	        finishProgram: function finishProgram(body, sourceType) {
	            this.type = Syntax.Program;
	            this.body = body;
	            this.sourceType = sourceType;
	            this.finish();
	            return this;
	        },

	        finishProperty: function finishProperty(kind, key, computed, value, method, shorthand) {
	            this.type = Syntax.Property;
	            this.key = key;
	            this.computed = computed;
	            this.value = value;
	            this.kind = kind;
	            this.method = method;
	            this.shorthand = shorthand;
	            this.finish();
	            return this;
	        },

	        finishRestElement: function finishRestElement(argument) {
	            this.type = Syntax.RestElement;
	            this.argument = argument;
	            this.finish();
	            return this;
	        },

	        finishReturnStatement: function finishReturnStatement(argument) {
	            this.type = Syntax.ReturnStatement;
	            this.argument = argument;
	            this.finish();
	            return this;
	        },

	        finishSequenceExpression: function finishSequenceExpression(expressions) {
	            this.type = Syntax.SequenceExpression;
	            this.expressions = expressions;
	            this.finish();
	            return this;
	        },

	        finishSpreadElement: function finishSpreadElement(argument) {
	            this.type = Syntax.SpreadElement;
	            this.argument = argument;
	            this.finish();
	            return this;
	        },

	        finishSwitchCase: function finishSwitchCase(test, consequent) {
	            this.type = Syntax.SwitchCase;
	            this.test = test;
	            this.consequent = consequent;
	            this.finish();
	            return this;
	        },

	        finishSuper: function finishSuper() {
	            this.type = Syntax.Super;
	            this.finish();
	            return this;
	        },

	        finishSwitchStatement: function finishSwitchStatement(discriminant, cases) {
	            this.type = Syntax.SwitchStatement;
	            this.discriminant = discriminant;
	            this.cases = cases;
	            this.finish();
	            return this;
	        },

	        finishTaggedTemplateExpression: function finishTaggedTemplateExpression(tag, quasi) {
	            this.type = Syntax.TaggedTemplateExpression;
	            this.tag = tag;
	            this.quasi = quasi;
	            this.finish();
	            return this;
	        },

	        finishTemplateElement: function finishTemplateElement(value, tail) {
	            this.type = Syntax.TemplateElement;
	            this.value = value;
	            this.tail = tail;
	            this.finish();
	            return this;
	        },

	        finishTemplateLiteral: function finishTemplateLiteral(quasis, expressions) {
	            this.type = Syntax.TemplateLiteral;
	            this.quasis = quasis;
	            this.expressions = expressions;
	            this.finish();
	            return this;
	        },

	        finishThisExpression: function finishThisExpression() {
	            this.type = Syntax.ThisExpression;
	            this.finish();
	            return this;
	        },

	        finishThrowStatement: function finishThrowStatement(argument) {
	            this.type = Syntax.ThrowStatement;
	            this.argument = argument;
	            this.finish();
	            return this;
	        },

	        finishTryStatement: function finishTryStatement(block, handler, finalizer) {
	            this.type = Syntax.TryStatement;
	            this.block = block;
	            this.guardedHandlers = [];
	            this.handlers = handler ? [handler] : [];
	            this.handler = handler;
	            this.finalizer = finalizer;
	            this.finish();
	            return this;
	        },

	        finishUnaryExpression: function finishUnaryExpression(operator, argument) {
	            this.type = operator === '++' || operator === '--' ? Syntax.UpdateExpression : Syntax.UnaryExpression;
	            this.operator = operator;
	            this.argument = argument;
	            this.prefix = true;
	            this.finish();
	            return this;
	        },

	        finishVariableDeclaration: function finishVariableDeclaration(declarations) {
	            this.type = Syntax.VariableDeclaration;
	            this.declarations = declarations;
	            this.kind = 'var';
	            this.finish();
	            return this;
	        },

	        finishLexicalDeclaration: function finishLexicalDeclaration(declarations, kind) {
	            this.type = Syntax.VariableDeclaration;
	            this.declarations = declarations;
	            this.kind = kind;
	            this.finish();
	            return this;
	        },

	        finishVariableDeclarator: function finishVariableDeclarator(id, init) {
	            this.type = Syntax.VariableDeclarator;
	            this.id = id;
	            this.init = init;
	            this.finish();
	            return this;
	        },

	        finishWhileStatement: function finishWhileStatement(test, body) {
	            this.type = Syntax.WhileStatement;
	            this.test = test;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishWithStatement: function finishWithStatement(object, body) {
	            this.type = Syntax.WithStatement;
	            this.object = object;
	            this.body = body;
	            this.finish();
	            return this;
	        },

	        finishExportSpecifier: function finishExportSpecifier(local, exported) {
	            this.type = Syntax.ExportSpecifier;
	            this.exported = exported || local;
	            this.local = local;
	            this.finish();
	            return this;
	        },

	        finishImportDefaultSpecifier: function finishImportDefaultSpecifier(local) {
	            this.type = Syntax.ImportDefaultSpecifier;
	            this.local = local;
	            this.finish();
	            return this;
	        },

	        finishImportNamespaceSpecifier: function finishImportNamespaceSpecifier(local) {
	            this.type = Syntax.ImportNamespaceSpecifier;
	            this.local = local;
	            this.finish();
	            return this;
	        },

	        finishExportNamedDeclaration: function finishExportNamedDeclaration(declaration, specifiers, src) {
	            this.type = Syntax.ExportNamedDeclaration;
	            this.declaration = declaration;
	            this.specifiers = specifiers;
	            this.source = src;
	            this.finish();
	            return this;
	        },

	        finishExportDefaultDeclaration: function finishExportDefaultDeclaration(declaration) {
	            this.type = Syntax.ExportDefaultDeclaration;
	            this.declaration = declaration;
	            this.finish();
	            return this;
	        },

	        finishExportAllDeclaration: function finishExportAllDeclaration(src) {
	            this.type = Syntax.ExportAllDeclaration;
	            this.source = src;
	            this.finish();
	            return this;
	        },

	        finishImportSpecifier: function finishImportSpecifier(local, imported) {
	            this.type = Syntax.ImportSpecifier;
	            this.local = local || imported;
	            this.imported = imported;
	            this.finish();
	            return this;
	        },

	        finishImportDeclaration: function finishImportDeclaration(specifiers, src) {
	            this.type = Syntax.ImportDeclaration;
	            this.specifiers = specifiers;
	            this.source = src;
	            this.finish();
	            return this;
	        },

	        finishYieldExpression: function finishYieldExpression(argument, delegate) {
	            this.type = Syntax.YieldExpression;
	            this.argument = argument;
	            this.delegate = delegate;
	            this.finish();
	            return this;
	        }
	    };

	    function recordError(error) {
	        var e, existing;

	        for (e = 0; e < extra.errors.length; e++) {
	            existing = extra.errors[e];
	            // Prevent duplicated error.
	            /* istanbul ignore next */
	            if (existing.index === error.index && existing.message === error.message) {
	                return;
	            }
	        }

	        extra.errors.push(error);
	    }

	    function constructError(msg, column) {
	        var error = new Error(msg);
	        try {
	            throw error;
	        } catch (base) {
	            /* istanbul ignore else */
	            if (Object.create && Object.defineProperty) {
	                error = Object.create(base);
	                Object.defineProperty(error, 'column', { value: column });
	            }
	        } finally {
	            return error;
	        }
	    }

	    function createError(line, pos, description) {
	        var msg, column, error;

	        msg = 'Line ' + line + ': ' + description;
	        column = pos - (scanning ? lineStart : lastLineStart) + 1;
	        error = constructError(msg, column);
	        error.lineNumber = line;
	        error.description = description;
	        error.index = pos;
	        return error;
	    }

	    // Throw an exception

	    function throwError(messageFormat) {
	        var args, msg;

	        args = Array.prototype.slice.call(arguments, 1);
	        msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
	            assert(idx < args.length, 'Message reference must be in range');
	            return args[idx];
	        });

	        throw createError(lastLineNumber, lastIndex, msg);
	    }

	    function tolerateError(messageFormat) {
	        var args, msg, error;

	        args = Array.prototype.slice.call(arguments, 1);
	        /* istanbul ignore next */
	        msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
	            assert(idx < args.length, 'Message reference must be in range');
	            return args[idx];
	        });

	        error = createError(lineNumber, lastIndex, msg);
	        if (extra.errors) {
	            recordError(error);
	        } else {
	            throw error;
	        }
	    }

	    // Throw an exception because of the token.

	    function unexpectedTokenError(token, message) {
	        var value,
	            msg = message || Messages.UnexpectedToken;

	        if (token) {
	            if (!message) {
	                msg = token.type === Token.EOF ? Messages.UnexpectedEOS : token.type === Token.Identifier ? Messages.UnexpectedIdentifier : token.type === Token.NumericLiteral ? Messages.UnexpectedNumber : token.type === Token.StringLiteral ? Messages.UnexpectedString : token.type === Token.Template ? Messages.UnexpectedTemplate : Messages.UnexpectedToken;

	                if (token.type === Token.Keyword) {
	                    if (isFutureReservedWord(token.value)) {
	                        msg = Messages.UnexpectedReserved;
	                    } else if (strict && isStrictModeReservedWord(token.value)) {
	                        msg = Messages.StrictReservedWord;
	                    }
	                }
	            }

	            value = token.type === Token.Template ? token.value.raw : token.value;
	        } else {
	            value = 'ILLEGAL';
	        }

	        msg = msg.replace('%0', value);

	        return token && typeof token.lineNumber === 'number' ? createError(token.lineNumber, token.start, msg) : createError(scanning ? lineNumber : lastLineNumber, scanning ? index : lastIndex, msg);
	    }

	    function throwUnexpectedToken(token, message) {
	        throw unexpectedTokenError(token, message);
	    }

	    function tolerateUnexpectedToken(token, message) {
	        var error = unexpectedTokenError(token, message);
	        if (extra.errors) {
	            recordError(error);
	        } else {
	            throw error;
	        }
	    }

	    // Expect the next token to match the specified punctuator.
	    // If not, an exception will be thrown.

	    function expect(value) {
	        var token = lex();
	        if (token.type !== Token.Punctuator || token.value !== value) {
	            throwUnexpectedToken(token);
	        }
	    }

	    /**
	     * @name expectCommaSeparator
	     * @description Quietly expect a comma when in tolerant mode, otherwise delegates
	     * to <code>expect(value)</code>
	     * @since 2.0
	     */
	    function expectCommaSeparator() {
	        var token;

	        if (extra.errors) {
	            token = lookahead;
	            if (token.type === Token.Punctuator && token.value === ',') {
	                lex();
	            } else if (token.type === Token.Punctuator && token.value === ';') {
	                lex();
	                tolerateUnexpectedToken(token);
	            } else {
	                tolerateUnexpectedToken(token, Messages.UnexpectedToken);
	            }
	        } else {
	            expect(',');
	        }
	    }

	    // Expect the next token to match the specified keyword.
	    // If not, an exception will be thrown.

	    function expectKeyword(keyword) {
	        var token = lex();
	        if (token.type !== Token.Keyword || token.value !== keyword) {
	            throwUnexpectedToken(token);
	        }
	    }

	    // Return true if the next token matches the specified punctuator.

	    function match(value) {
	        return lookahead.type === Token.Punctuator && lookahead.value === value;
	    }

	    // Return true if the next token matches the specified keyword

	    function matchKeyword(keyword) {
	        return lookahead.type === Token.Keyword && lookahead.value === keyword;
	    }

	    // Return true if the next token matches the specified contextual keyword
	    // (where an identifier is sometimes a keyword depending on the context)

	    function matchContextualKeyword(keyword) {
	        return lookahead.type === Token.Identifier && lookahead.value === keyword;
	    }

	    // Return true if the next token is an assignment operator

	    function matchAssign() {
	        var op;

	        if (lookahead.type !== Token.Punctuator) {
	            return false;
	        }
	        op = lookahead.value;
	        return op === '=' || op === '*=' || op === '/=' || op === '%=' || op === '+=' || op === '-=' || op === '<<=' || op === '>>=' || op === '>>>=' || op === '&=' || op === '^=' || op === '|=';
	    }

	    function consumeSemicolon() {
	        // Catch the very common case first: immediately a semicolon (U+003B).
	        if (source.charCodeAt(startIndex) === 0x3B || match(';')) {
	            lex();
	            return;
	        }

	        if (hasLineTerminator) {
	            return;
	        }

	        // FIXME(ikarienator): this is seemingly an issue in the previous location info convention.
	        lastIndex = startIndex;
	        lastLineNumber = startLineNumber;
	        lastLineStart = startLineStart;

	        if (lookahead.type !== Token.EOF && !match('}')) {
	            throwUnexpectedToken(lookahead);
	        }
	    }

	    // Cover grammar support.
	    //
	    // When an assignment expression position starts with an left parenthesis, the determination of the type
	    // of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
	    // or the first comma. This situation also defers the determination of all the expressions nested in the pair.
	    //
	    // There are three productions that can be parsed in a parentheses pair that needs to be determined
	    // after the outermost pair is closed. They are:
	    //
	    //   1. AssignmentExpression
	    //   2. BindingElements
	    //   3. AssignmentTargets
	    //
	    // In order to avoid exponential backtracking, we use two flags to denote if the production can be
	    // binding element or assignment target.
	    //
	    // The three productions have the relationship:
	    //
	    //   BindingElements ⊆ AssignmentTargets ⊆ AssignmentExpression
	    //
	    // with a single exception that CoverInitializedName when used directly in an Expression, generates
	    // an early error. Therefore, we need the third state, firstCoverInitializedNameError, to track the
	    // first usage of CoverInitializedName and report it when we reached the end of the parentheses pair.
	    //
	    // isolateCoverGrammar function runs the given parser function with a new cover grammar context, and it does not
	    // effect the current flags. This means the production the parser parses is only used as an expression. Therefore
	    // the CoverInitializedName check is conducted.
	    //
	    // inheritCoverGrammar function runs the given parse function with a new cover grammar context, and it propagates
	    // the flags outside of the parser. This means the production the parser parses is used as a part of a potential
	    // pattern. The CoverInitializedName check is deferred.
	    function isolateCoverGrammar(parser) {
	        var oldIsBindingElement = isBindingElement,
	            oldIsAssignmentTarget = isAssignmentTarget,
	            oldFirstCoverInitializedNameError = firstCoverInitializedNameError,
	            result;
	        isBindingElement = true;
	        isAssignmentTarget = true;
	        firstCoverInitializedNameError = null;
	        result = parser();
	        if (firstCoverInitializedNameError !== null) {
	            throwUnexpectedToken(firstCoverInitializedNameError);
	        }
	        isBindingElement = oldIsBindingElement;
	        isAssignmentTarget = oldIsAssignmentTarget;
	        firstCoverInitializedNameError = oldFirstCoverInitializedNameError;
	        return result;
	    }

	    function inheritCoverGrammar(parser) {
	        var oldIsBindingElement = isBindingElement,
	            oldIsAssignmentTarget = isAssignmentTarget,
	            oldFirstCoverInitializedNameError = firstCoverInitializedNameError,
	            result;
	        isBindingElement = true;
	        isAssignmentTarget = true;
	        firstCoverInitializedNameError = null;
	        result = parser();
	        isBindingElement = isBindingElement && oldIsBindingElement;
	        isAssignmentTarget = isAssignmentTarget && oldIsAssignmentTarget;
	        firstCoverInitializedNameError = oldFirstCoverInitializedNameError || firstCoverInitializedNameError;
	        return result;
	    }

	    // ECMA-262 13.3.3 Destructuring Binding Patterns

	    function parseArrayPattern(params, kind) {
	        var node = new Node(),
	            elements = [],
	            rest,
	            restNode;
	        expect('[');

	        while (!match(']')) {
	            if (match(',')) {
	                lex();
	                elements.push(null);
	            } else {
	                if (match('...')) {
	                    restNode = new Node();
	                    lex();
	                    params.push(lookahead);
	                    rest = parseVariableIdentifier(kind);
	                    elements.push(restNode.finishRestElement(rest));
	                    break;
	                } else {
	                    elements.push(parsePatternWithDefault(params, kind));
	                }
	                if (!match(']')) {
	                    expect(',');
	                }
	            }
	        }

	        expect(']');

	        return node.finishArrayPattern(elements);
	    }

	    function parsePropertyPattern(params, kind) {
	        var node = new Node(),
	            key,
	            keyToken,
	            computed = match('['),
	            init;
	        if (lookahead.type === Token.Identifier) {
	            keyToken = lookahead;
	            key = parseVariableIdentifier();
	            if (match('=')) {
	                params.push(keyToken);
	                lex();
	                init = parseAssignmentExpression();

	                return node.finishProperty('init', key, false, new WrappingNode(keyToken).finishAssignmentPattern(key, init), false, true);
	            } else if (!match(':')) {
	                params.push(keyToken);
	                return node.finishProperty('init', key, false, key, false, true);
	            }
	        } else {
	            key = parseObjectPropertyKey();
	        }
	        expect(':');
	        init = parsePatternWithDefault(params, kind);
	        return node.finishProperty('init', key, computed, init, false, false);
	    }

	    function parseObjectPattern(params, kind) {
	        var node = new Node(),
	            properties = [];

	        expect('{');

	        while (!match('}')) {
	            properties.push(parsePropertyPattern(params, kind));
	            if (!match('}')) {
	                expect(',');
	            }
	        }

	        lex();

	        return node.finishObjectPattern(properties);
	    }

	    function parsePattern(params, kind) {
	        if (match('[')) {
	            return parseArrayPattern(params, kind);
	        } else if (match('{')) {
	            return parseObjectPattern(params, kind);
	        } else if (matchKeyword('let')) {
	            if (kind === 'const' || kind === 'let') {
	                tolerateUnexpectedToken(lookahead, Messages.UnexpectedToken);
	            }
	        }

	        params.push(lookahead);
	        return parseVariableIdentifier(kind);
	    }

	    function parsePatternWithDefault(params, kind) {
	        var startToken = lookahead,
	            pattern,
	            previousAllowYield,
	            right;
	        pattern = parsePattern(params, kind);
	        if (match('=')) {
	            lex();
	            previousAllowYield = state.allowYield;
	            state.allowYield = true;
	            right = isolateCoverGrammar(parseAssignmentExpression);
	            state.allowYield = previousAllowYield;
	            pattern = new WrappingNode(startToken).finishAssignmentPattern(pattern, right);
	        }
	        return pattern;
	    }

	    // ECMA-262 12.2.5 Array Initializer

	    function parseArrayInitializer() {
	        var elements = [],
	            node = new Node(),
	            restSpread;

	        expect('[');

	        while (!match(']')) {
	            if (match(',')) {
	                lex();
	                elements.push(null);
	            } else if (match('...')) {
	                restSpread = new Node();
	                lex();
	                restSpread.finishSpreadElement(inheritCoverGrammar(parseAssignmentExpression));

	                if (!match(']')) {
	                    isAssignmentTarget = isBindingElement = false;
	                    expect(',');
	                }
	                elements.push(restSpread);
	            } else {
	                elements.push(inheritCoverGrammar(parseAssignmentExpression));

	                if (!match(']')) {
	                    expect(',');
	                }
	            }
	        }

	        lex();

	        return node.finishArrayExpression(elements);
	    }

	    // ECMA-262 12.2.6 Object Initializer

	    function parsePropertyFunction(node, paramInfo, isGenerator) {
	        var previousStrict, body;

	        isAssignmentTarget = isBindingElement = false;

	        previousStrict = strict;
	        body = isolateCoverGrammar(parseFunctionSourceElements);

	        if (strict && paramInfo.firstRestricted) {
	            tolerateUnexpectedToken(paramInfo.firstRestricted, paramInfo.message);
	        }
	        if (strict && paramInfo.stricted) {
	            tolerateUnexpectedToken(paramInfo.stricted, paramInfo.message);
	        }

	        strict = previousStrict;
	        return node.finishFunctionExpression(null, paramInfo.params, paramInfo.defaults, body, isGenerator);
	    }

	    function parsePropertyMethodFunction() {
	        var params,
	            method,
	            node = new Node(),
	            previousAllowYield = state.allowYield;

	        state.allowYield = false;
	        params = parseParams();
	        state.allowYield = previousAllowYield;

	        state.allowYield = false;
	        method = parsePropertyFunction(node, params, false);
	        state.allowYield = previousAllowYield;

	        return method;
	    }

	    function parseObjectPropertyKey() {
	        var token,
	            node = new Node(),
	            expr;

	        token = lex();

	        // Note: This function is called only from parseObjectProperty(), where
	        // EOF and Punctuator tokens are already filtered out.

	        switch (token.type) {
	            case Token.StringLiteral:
	            case Token.NumericLiteral:
	                if (strict && token.octal) {
	                    tolerateUnexpectedToken(token, Messages.StrictOctalLiteral);
	                }
	                return node.finishLiteral(token);
	            case Token.Identifier:
	            case Token.BooleanLiteral:
	            case Token.NullLiteral:
	            case Token.Keyword:
	                return node.finishIdentifier(token.value);
	            case Token.Punctuator:
	                if (token.value === '[') {
	                    expr = isolateCoverGrammar(parseAssignmentExpression);
	                    expect(']');
	                    return expr;
	                }
	                break;
	        }
	        throwUnexpectedToken(token);
	    }

	    function lookaheadPropertyName() {
	        switch (lookahead.type) {
	            case Token.Identifier:
	            case Token.StringLiteral:
	            case Token.BooleanLiteral:
	            case Token.NullLiteral:
	            case Token.NumericLiteral:
	            case Token.Keyword:
	                return true;
	            case Token.Punctuator:
	                return lookahead.value === '[';
	        }
	        return false;
	    }

	    // This function is to try to parse a MethodDefinition as defined in 14.3. But in the case of object literals,
	    // it might be called at a position where there is in fact a short hand identifier pattern or a data property.
	    // This can only be determined after we consumed up to the left parentheses.
	    //
	    // In order to avoid back tracking, it returns `null` if the position is not a MethodDefinition and the caller
	    // is responsible to visit other options.
	    function tryParseMethodDefinition(token, key, computed, node) {
	        var value,
	            options,
	            methodNode,
	            params,
	            previousAllowYield = state.allowYield;

	        if (token.type === Token.Identifier) {
	            // check for `get` and `set`;

	            if (token.value === 'get' && lookaheadPropertyName()) {
	                computed = match('[');
	                key = parseObjectPropertyKey();
	                methodNode = new Node();
	                expect('(');
	                expect(')');

	                state.allowYield = false;
	                value = parsePropertyFunction(methodNode, {
	                    params: [],
	                    defaults: [],
	                    stricted: null,
	                    firstRestricted: null,
	                    message: null
	                }, false);
	                state.allowYield = previousAllowYield;

	                return node.finishProperty('get', key, computed, value, false, false);
	            } else if (token.value === 'set' && lookaheadPropertyName()) {
	                computed = match('[');
	                key = parseObjectPropertyKey();
	                methodNode = new Node();
	                expect('(');

	                options = {
	                    params: [],
	                    defaultCount: 0,
	                    defaults: [],
	                    firstRestricted: null,
	                    paramSet: {}
	                };
	                if (match(')')) {
	                    tolerateUnexpectedToken(lookahead);
	                } else {
	                    state.allowYield = false;
	                    parseParam(options);
	                    state.allowYield = previousAllowYield;
	                    if (options.defaultCount === 0) {
	                        options.defaults = [];
	                    }
	                }
	                expect(')');

	                state.allowYield = false;
	                value = parsePropertyFunction(methodNode, options, false);
	                state.allowYield = previousAllowYield;

	                return node.finishProperty('set', key, computed, value, false, false);
	            }
	        } else if (token.type === Token.Punctuator && token.value === '*' && lookaheadPropertyName()) {
	            computed = match('[');
	            key = parseObjectPropertyKey();
	            methodNode = new Node();

	            state.allowYield = true;
	            params = parseParams();
	            state.allowYield = previousAllowYield;

	            state.allowYield = false;
	            value = parsePropertyFunction(methodNode, params, true);
	            state.allowYield = previousAllowYield;

	            return node.finishProperty('init', key, computed, value, true, false);
	        }

	        if (key && match('(')) {
	            value = parsePropertyMethodFunction();
	            return node.finishProperty('init', key, computed, value, true, false);
	        }

	        // Not a MethodDefinition.
	        return null;
	    }

	    function parseObjectProperty(hasProto) {
	        var token = lookahead,
	            node = new Node(),
	            computed,
	            key,
	            maybeMethod,
	            proto,
	            value;

	        computed = match('[');
	        if (match('*')) {
	            lex();
	        } else {
	            key = parseObjectPropertyKey();
	        }
	        maybeMethod = tryParseMethodDefinition(token, key, computed, node);
	        if (maybeMethod) {
	            return maybeMethod;
	        }

	        if (!key) {
	            throwUnexpectedToken(lookahead);
	        }

	        // Check for duplicated __proto__
	        if (!computed) {
	            proto = key.type === Syntax.Identifier && key.name === '__proto__' || key.type === Syntax.Literal && key.value === '__proto__';
	            if (hasProto.value && proto) {
	                tolerateError(Messages.DuplicateProtoProperty);
	            }
	            hasProto.value |= proto;
	        }

	        if (match(':')) {
	            lex();
	            value = inheritCoverGrammar(parseAssignmentExpression);
	            return node.finishProperty('init', key, computed, value, false, false);
	        }

	        if (token.type === Token.Identifier) {
	            if (match('=')) {
	                firstCoverInitializedNameError = lookahead;
	                lex();
	                value = isolateCoverGrammar(parseAssignmentExpression);
	                return node.finishProperty('init', key, computed, new WrappingNode(token).finishAssignmentPattern(key, value), false, true);
	            }
	            return node.finishProperty('init', key, computed, key, false, true);
	        }

	        throwUnexpectedToken(lookahead);
	    }

	    function parseObjectInitializer() {
	        var properties = [],
	            hasProto = { value: false },
	            node = new Node();

	        expect('{');

	        while (!match('}')) {
	            properties.push(parseObjectProperty(hasProto));

	            if (!match('}')) {
	                expectCommaSeparator();
	            }
	        }

	        expect('}');

	        return node.finishObjectExpression(properties);
	    }

	    function reinterpretExpressionAsPattern(expr) {
	        var i;
	        switch (expr.type) {
	            case Syntax.Identifier:
	            case Syntax.MemberExpression:
	            case Syntax.RestElement:
	            case Syntax.AssignmentPattern:
	                break;
	            case Syntax.SpreadElement:
	                expr.type = Syntax.RestElement;
	                reinterpretExpressionAsPattern(expr.argument);
	                break;
	            case Syntax.ArrayExpression:
	                expr.type = Syntax.ArrayPattern;
	                for (i = 0; i < expr.elements.length; i++) {
	                    if (expr.elements[i] !== null) {
	                        reinterpretExpressionAsPattern(expr.elements[i]);
	                    }
	                }
	                break;
	            case Syntax.ObjectExpression:
	                expr.type = Syntax.ObjectPattern;
	                for (i = 0; i < expr.properties.length; i++) {
	                    reinterpretExpressionAsPattern(expr.properties[i].value);
	                }
	                break;
	            case Syntax.AssignmentExpression:
	                expr.type = Syntax.AssignmentPattern;
	                reinterpretExpressionAsPattern(expr.left);
	                break;
	            default:
	                // Allow other node type for tolerant parsing.
	                break;
	        }
	    }

	    // ECMA-262 12.2.9 Template Literals

	    function parseTemplateElement(option) {
	        var node, token;

	        if (lookahead.type !== Token.Template || option.head && !lookahead.head) {
	            throwUnexpectedToken();
	        }

	        node = new Node();
	        token = lex();

	        return node.finishTemplateElement({ raw: token.value.raw, cooked: token.value.cooked }, token.tail);
	    }

	    function parseTemplateLiteral() {
	        var quasi,
	            quasis,
	            expressions,
	            node = new Node();

	        quasi = parseTemplateElement({ head: true });
	        quasis = [quasi];
	        expressions = [];

	        while (!quasi.tail) {
	            expressions.push(parseExpression());
	            quasi = parseTemplateElement({ head: false });
	            quasis.push(quasi);
	        }

	        return node.finishTemplateLiteral(quasis, expressions);
	    }

	    // ECMA-262 12.2.10 The Grouping Operator

	    function parseGroupExpression() {
	        var expr,
	            expressions,
	            startToken,
	            i,
	            params = [];

	        expect('(');

	        if (match(')')) {
	            lex();
	            if (!match('=>')) {
	                expect('=>');
	            }
	            return {
	                type: PlaceHolders.ArrowParameterPlaceHolder,
	                params: [],
	                rawParams: []
	            };
	        }

	        startToken = lookahead;
	        if (match('...')) {
	            expr = parseRestElement(params);
	            expect(')');
	            if (!match('=>')) {
	                expect('=>');
	            }
	            return {
	                type: PlaceHolders.ArrowParameterPlaceHolder,
	                params: [expr]
	            };
	        }

	        isBindingElement = true;
	        expr = inheritCoverGrammar(parseAssignmentExpression);

	        if (match(',')) {
	            isAssignmentTarget = false;
	            expressions = [expr];

	            while (startIndex < length) {
	                if (!match(',')) {
	                    break;
	                }
	                lex();

	                if (match('...')) {
	                    if (!isBindingElement) {
	                        throwUnexpectedToken(lookahead);
	                    }
	                    expressions.push(parseRestElement(params));
	                    expect(')');
	                    if (!match('=>')) {
	                        expect('=>');
	                    }
	                    isBindingElement = false;
	                    for (i = 0; i < expressions.length; i++) {
	                        reinterpretExpressionAsPattern(expressions[i]);
	                    }
	                    return {
	                        type: PlaceHolders.ArrowParameterPlaceHolder,
	                        params: expressions
	                    };
	                }

	                expressions.push(inheritCoverGrammar(parseAssignmentExpression));
	            }

	            expr = new WrappingNode(startToken).finishSequenceExpression(expressions);
	        }

	        expect(')');

	        if (match('=>')) {
	            if (expr.type === Syntax.Identifier && expr.name === 'yield') {
	                return {
	                    type: PlaceHolders.ArrowParameterPlaceHolder,
	                    params: [expr]
	                };
	            }

	            if (!isBindingElement) {
	                throwUnexpectedToken(lookahead);
	            }

	            if (expr.type === Syntax.SequenceExpression) {
	                for (i = 0; i < expr.expressions.length; i++) {
	                    reinterpretExpressionAsPattern(expr.expressions[i]);
	                }
	            } else {
	                reinterpretExpressionAsPattern(expr);
	            }

	            expr = {
	                type: PlaceHolders.ArrowParameterPlaceHolder,
	                params: expr.type === Syntax.SequenceExpression ? expr.expressions : [expr]
	            };
	        }
	        isBindingElement = false;
	        return expr;
	    }

	    // ECMA-262 12.2 Primary Expressions

	    function parsePrimaryExpression() {
	        var type, token, expr, node;

	        if (match('(')) {
	            isBindingElement = false;
	            return inheritCoverGrammar(parseGroupExpression);
	        }

	        if (match('[')) {
	            return inheritCoverGrammar(parseArrayInitializer);
	        }

	        if (match('{')) {
	            return inheritCoverGrammar(parseObjectInitializer);
	        }

	        type = lookahead.type;
	        node = new Node();

	        if (type === Token.Identifier) {
	            if (state.sourceType === 'module' && lookahead.value === 'await') {
	                tolerateUnexpectedToken(lookahead);
	            }
	            expr = node.finishIdentifier(lex().value);
	        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
	            isAssignmentTarget = isBindingElement = false;
	            if (strict && lookahead.octal) {
	                tolerateUnexpectedToken(lookahead, Messages.StrictOctalLiteral);
	            }
	            expr = node.finishLiteral(lex());
	        } else if (type === Token.Keyword) {
	            if (!strict && state.allowYield && matchKeyword('yield')) {
	                return parseNonComputedProperty();
	            }
	            if (!strict && matchKeyword('let')) {
	                return node.finishIdentifier(lex().value);
	            }
	            isAssignmentTarget = isBindingElement = false;
	            if (matchKeyword('function')) {
	                return parseFunctionExpression();
	            }
	            if (matchKeyword('this')) {
	                lex();
	                return node.finishThisExpression();
	            }
	            if (matchKeyword('class')) {
	                return parseClassExpression();
	            }
	            throwUnexpectedToken(lex());
	        } else if (type === Token.BooleanLiteral) {
	            isAssignmentTarget = isBindingElement = false;
	            token = lex();
	            token.value = token.value === 'true';
	            expr = node.finishLiteral(token);
	        } else if (type === Token.NullLiteral) {
	            isAssignmentTarget = isBindingElement = false;
	            token = lex();
	            token.value = null;
	            expr = node.finishLiteral(token);
	        } else if (match('/') || match('/=')) {
	            isAssignmentTarget = isBindingElement = false;
	            index = startIndex;

	            if (typeof extra.tokens !== 'undefined') {
	                token = collectRegex();
	            } else {
	                token = scanRegExp();
	            }
	            lex();
	            expr = node.finishLiteral(token);
	        } else if (type === Token.Template) {
	            expr = parseTemplateLiteral();
	        } else {
	            throwUnexpectedToken(lex());
	        }

	        return expr;
	    }

	    // ECMA-262 12.3 Left-Hand-Side Expressions

	    function parseArguments() {
	        var args = [],
	            expr;

	        expect('(');

	        if (!match(')')) {
	            while (startIndex < length) {
	                if (match('...')) {
	                    expr = new Node();
	                    lex();
	                    expr.finishSpreadElement(isolateCoverGrammar(parseAssignmentExpression));
	                } else {
	                    expr = isolateCoverGrammar(parseAssignmentExpression);
	                }
	                args.push(expr);
	                if (match(')')) {
	                    break;
	                }
	                expectCommaSeparator();
	            }
	        }

	        expect(')');

	        return args;
	    }

	    function parseNonComputedProperty() {
	        var token,
	            node = new Node();

	        token = lex();

	        if (!isIdentifierName(token)) {
	            throwUnexpectedToken(token);
	        }

	        return node.finishIdentifier(token.value);
	    }

	    function parseNonComputedMember() {
	        expect('.');

	        return parseNonComputedProperty();
	    }

	    function parseComputedMember() {
	        var expr;

	        expect('[');

	        expr = isolateCoverGrammar(parseExpression);

	        expect(']');

	        return expr;
	    }

	    // ECMA-262 12.3.3 The new Operator

	    function parseNewExpression() {
	        var callee,
	            args,
	            node = new Node();

	        expectKeyword('new');

	        if (match('.')) {
	            lex();
	            if (lookahead.type === Token.Identifier && lookahead.value === 'target') {
	                if (state.inFunctionBody) {
	                    lex();
	                    return node.finishMetaProperty('new', 'target');
	                }
	            }
	            throwUnexpectedToken(lookahead);
	        }

	        callee = isolateCoverGrammar(parseLeftHandSideExpression);
	        args = match('(') ? parseArguments() : [];

	        isAssignmentTarget = isBindingElement = false;

	        return node.finishNewExpression(callee, args);
	    }

	    // ECMA-262 12.3.4 Function Calls

	    function parseLeftHandSideExpressionAllowCall() {
	        var quasi,
	            expr,
	            args,
	            property,
	            startToken,
	            previousAllowIn = state.allowIn;

	        startToken = lookahead;
	        state.allowIn = true;

	        if (matchKeyword('super') && state.inFunctionBody) {
	            expr = new Node();
	            lex();
	            expr = expr.finishSuper();
	            if (!match('(') && !match('.') && !match('[')) {
	                throwUnexpectedToken(lookahead);
	            }
	        } else {
	            expr = inheritCoverGrammar(matchKeyword('new') ? parseNewExpression : parsePrimaryExpression);
	        }

	        for (;;) {
	            if (match('.')) {
	                isBindingElement = false;
	                isAssignmentTarget = true;
	                property = parseNonComputedMember();
	                expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
	            } else if (match('(')) {
	                isBindingElement = false;
	                isAssignmentTarget = false;
	                args = parseArguments();
	                expr = new WrappingNode(startToken).finishCallExpression(expr, args);
	            } else if (match('[')) {
	                isBindingElement = false;
	                isAssignmentTarget = true;
	                property = parseComputedMember();
	                expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
	            } else if (lookahead.type === Token.Template && lookahead.head) {
	                quasi = parseTemplateLiteral();
	                expr = new WrappingNode(startToken).finishTaggedTemplateExpression(expr, quasi);
	            } else {
	                break;
	            }
	        }
	        state.allowIn = previousAllowIn;

	        return expr;
	    }

	    // ECMA-262 12.3 Left-Hand-Side Expressions

	    function parseLeftHandSideExpression() {
	        var quasi, expr, property, startToken;
	        assert(state.allowIn, 'callee of new expression always allow in keyword.');

	        startToken = lookahead;

	        if (matchKeyword('super') && state.inFunctionBody) {
	            expr = new Node();
	            lex();
	            expr = expr.finishSuper();
	            if (!match('[') && !match('.')) {
	                throwUnexpectedToken(lookahead);
	            }
	        } else {
	            expr = inheritCoverGrammar(matchKeyword('new') ? parseNewExpression : parsePrimaryExpression);
	        }

	        for (;;) {
	            if (match('[')) {
	                isBindingElement = false;
	                isAssignmentTarget = true;
	                property = parseComputedMember();
	                expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
	            } else if (match('.')) {
	                isBindingElement = false;
	                isAssignmentTarget = true;
	                property = parseNonComputedMember();
	                expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
	            } else if (lookahead.type === Token.Template && lookahead.head) {
	                quasi = parseTemplateLiteral();
	                expr = new WrappingNode(startToken).finishTaggedTemplateExpression(expr, quasi);
	            } else {
	                break;
	            }
	        }
	        return expr;
	    }

	    // ECMA-262 12.4 Postfix Expressions

	    function parsePostfixExpression() {
	        var expr,
	            token,
	            startToken = lookahead;

	        expr = inheritCoverGrammar(parseLeftHandSideExpressionAllowCall);

	        if (!hasLineTerminator && lookahead.type === Token.Punctuator) {
	            if (match('++') || match('--')) {
	                // ECMA-262 11.3.1, 11.3.2
	                if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                    tolerateError(Messages.StrictLHSPostfix);
	                }

	                if (!isAssignmentTarget) {
	                    tolerateError(Messages.InvalidLHSInAssignment);
	                }

	                isAssignmentTarget = isBindingElement = false;

	                token = lex();
	                expr = new WrappingNode(startToken).finishPostfixExpression(token.value, expr);
	            }
	        }

	        return expr;
	    }

	    // ECMA-262 12.5 Unary Operators

	    function parseUnaryExpression() {
	        var token, expr, startToken;

	        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
	            expr = parsePostfixExpression();
	        } else if (match('++') || match('--')) {
	            startToken = lookahead;
	            token = lex();
	            expr = inheritCoverGrammar(parseUnaryExpression);
	            // ECMA-262 11.4.4, 11.4.5
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                tolerateError(Messages.StrictLHSPrefix);
	            }

	            if (!isAssignmentTarget) {
	                tolerateError(Messages.InvalidLHSInAssignment);
	            }
	            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
	            isAssignmentTarget = isBindingElement = false;
	        } else if (match('+') || match('-') || match('~') || match('!')) {
	            startToken = lookahead;
	            token = lex();
	            expr = inheritCoverGrammar(parseUnaryExpression);
	            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
	            isAssignmentTarget = isBindingElement = false;
	        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
	            startToken = lookahead;
	            token = lex();
	            expr = inheritCoverGrammar(parseUnaryExpression);
	            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
	            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
	                tolerateError(Messages.StrictDelete);
	            }
	            isAssignmentTarget = isBindingElement = false;
	        } else {
	            expr = parsePostfixExpression();
	        }

	        return expr;
	    }

	    function binaryPrecedence(token, allowIn) {
	        var prec = 0;

	        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
	            return 0;
	        }

	        switch (token.value) {
	            case '||':
	                prec = 1;
	                break;

	            case '&&':
	                prec = 2;
	                break;

	            case '|':
	                prec = 3;
	                break;

	            case '^':
	                prec = 4;
	                break;

	            case '&':
	                prec = 5;
	                break;

	            case '==':
	            case '!=':
	            case '===':
	            case '!==':
	                prec = 6;
	                break;

	            case '<':
	            case '>':
	            case '<=':
	            case '>=':
	            case 'instanceof':
	                prec = 7;
	                break;

	            case 'in':
	                prec = allowIn ? 7 : 0;
	                break;

	            case '<<':
	            case '>>':
	            case '>>>':
	                prec = 8;
	                break;

	            case '+':
	            case '-':
	                prec = 9;
	                break;

	            case '*':
	            case '/':
	            case '%':
	                prec = 11;
	                break;

	            default:
	                break;
	        }

	        return prec;
	    }

	    // ECMA-262 12.6 Multiplicative Operators
	    // ECMA-262 12.7 Additive Operators
	    // ECMA-262 12.8 Bitwise Shift Operators
	    // ECMA-262 12.9 Relational Operators
	    // ECMA-262 12.10 Equality Operators
	    // ECMA-262 12.11 Binary Bitwise Operators
	    // ECMA-262 12.12 Binary Logical Operators

	    function parseBinaryExpression() {
	        var marker, markers, expr, token, prec, stack, right, operator, left, i;

	        marker = lookahead;
	        left = inheritCoverGrammar(parseUnaryExpression);

	        token = lookahead;
	        prec = binaryPrecedence(token, state.allowIn);
	        if (prec === 0) {
	            return left;
	        }
	        isAssignmentTarget = isBindingElement = false;
	        token.prec = prec;
	        lex();

	        markers = [marker, lookahead];
	        right = isolateCoverGrammar(parseUnaryExpression);

	        stack = [left, token, right];

	        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {

	            // Reduce: make a binary expression from the three topmost entries.
	            while (stack.length > 2 && prec <= stack[stack.length - 2].prec) {
	                right = stack.pop();
	                operator = stack.pop().value;
	                left = stack.pop();
	                markers.pop();
	                expr = new WrappingNode(markers[markers.length - 1]).finishBinaryExpression(operator, left, right);
	                stack.push(expr);
	            }

	            // Shift.
	            token = lex();
	            token.prec = prec;
	            stack.push(token);
	            markers.push(lookahead);
	            expr = isolateCoverGrammar(parseUnaryExpression);
	            stack.push(expr);
	        }

	        // Final reduce to clean-up the stack.
	        i = stack.length - 1;
	        expr = stack[i];
	        markers.pop();
	        while (i > 1) {
	            expr = new WrappingNode(markers.pop()).finishBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
	            i -= 2;
	        }

	        return expr;
	    }

	    // ECMA-262 12.13 Conditional Operator

	    function parseConditionalExpression() {
	        var expr, previousAllowIn, consequent, alternate, startToken;

	        startToken = lookahead;

	        expr = inheritCoverGrammar(parseBinaryExpression);
	        if (match('?')) {
	            lex();
	            previousAllowIn = state.allowIn;
	            state.allowIn = true;
	            consequent = isolateCoverGrammar(parseAssignmentExpression);
	            state.allowIn = previousAllowIn;
	            expect(':');
	            alternate = isolateCoverGrammar(parseAssignmentExpression);

	            expr = new WrappingNode(startToken).finishConditionalExpression(expr, consequent, alternate);
	            isAssignmentTarget = isBindingElement = false;
	        }

	        return expr;
	    }

	    // ECMA-262 14.2 Arrow Function Definitions

	    function parseConciseBody() {
	        if (match('{')) {
	            return parseFunctionSourceElements();
	        }
	        return isolateCoverGrammar(parseAssignmentExpression);
	    }

	    function checkPatternParam(options, param) {
	        var i;
	        switch (param.type) {
	            case Syntax.Identifier:
	                validateParam(options, param, param.name);
	                break;
	            case Syntax.RestElement:
	                checkPatternParam(options, param.argument);
	                break;
	            case Syntax.AssignmentPattern:
	                checkPatternParam(options, param.left);
	                break;
	            case Syntax.ArrayPattern:
	                for (i = 0; i < param.elements.length; i++) {
	                    if (param.elements[i] !== null) {
	                        checkPatternParam(options, param.elements[i]);
	                    }
	                }
	                break;
	            case Syntax.YieldExpression:
	                break;
	            default:
	                assert(param.type === Syntax.ObjectPattern, 'Invalid type');
	                for (i = 0; i < param.properties.length; i++) {
	                    checkPatternParam(options, param.properties[i].value);
	                }
	                break;
	        }
	    }
	    function reinterpretAsCoverFormalsList(expr) {
	        var i, len, param, params, defaults, defaultCount, options, token;

	        defaults = [];
	        defaultCount = 0;
	        params = [expr];

	        switch (expr.type) {
	            case Syntax.Identifier:
	                break;
	            case PlaceHolders.ArrowParameterPlaceHolder:
	                params = expr.params;
	                break;
	            default:
	                return null;
	        }

	        options = {
	            paramSet: {}
	        };

	        for (i = 0, len = params.length; i < len; i += 1) {
	            param = params[i];
	            switch (param.type) {
	                case Syntax.AssignmentPattern:
	                    params[i] = param.left;
	                    if (param.right.type === Syntax.YieldExpression) {
	                        if (param.right.argument) {
	                            throwUnexpectedToken(lookahead);
	                        }
	                        param.right.type = Syntax.Identifier;
	                        param.right.name = 'yield';
	                        delete param.right.argument;
	                        delete param.right.delegate;
	                    }
	                    defaults.push(param.right);
	                    ++defaultCount;
	                    checkPatternParam(options, param.left);
	                    break;
	                default:
	                    checkPatternParam(options, param);
	                    params[i] = param;
	                    defaults.push(null);
	                    break;
	            }
	        }

	        if (strict || !state.allowYield) {
	            for (i = 0, len = params.length; i < len; i += 1) {
	                param = params[i];
	                if (param.type === Syntax.YieldExpression) {
	                    throwUnexpectedToken(lookahead);
	                }
	            }
	        }

	        if (options.message === Messages.StrictParamDupe) {
	            token = strict ? options.stricted : options.firstRestricted;
	            throwUnexpectedToken(token, options.message);
	        }

	        if (defaultCount === 0) {
	            defaults = [];
	        }

	        return {
	            params: params,
	            defaults: defaults,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    }

	    function parseArrowFunctionExpression(options, node) {
	        var previousStrict, previousAllowYield, body;

	        if (hasLineTerminator) {
	            tolerateUnexpectedToken(lookahead);
	        }
	        expect('=>');

	        previousStrict = strict;
	        previousAllowYield = state.allowYield;
	        state.allowYield = true;

	        body = parseConciseBody();

	        if (strict && options.firstRestricted) {
	            throwUnexpectedToken(options.firstRestricted, options.message);
	        }
	        if (strict && options.stricted) {
	            tolerateUnexpectedToken(options.stricted, options.message);
	        }

	        strict = previousStrict;
	        state.allowYield = previousAllowYield;

	        return node.finishArrowFunctionExpression(options.params, options.defaults, body, body.type !== Syntax.BlockStatement);
	    }

	    // ECMA-262 14.4 Yield expression

	    function parseYieldExpression() {
	        var argument, expr, delegate, previousAllowYield;

	        argument = null;
	        expr = new Node();
	        delegate = false;

	        expectKeyword('yield');

	        if (!hasLineTerminator) {
	            previousAllowYield = state.allowYield;
	            state.allowYield = false;
	            delegate = match('*');
	            if (delegate) {
	                lex();
	                argument = parseAssignmentExpression();
	            } else {
	                if (!match(';') && !match('}') && !match(')') && lookahead.type !== Token.EOF) {
	                    argument = parseAssignmentExpression();
	                }
	            }
	            state.allowYield = previousAllowYield;
	        }

	        return expr.finishYieldExpression(argument, delegate);
	    }

	    // ECMA-262 12.14 Assignment Operators

	    function parseAssignmentExpression() {
	        var token, expr, right, list, startToken;

	        startToken = lookahead;
	        token = lookahead;

	        if (!state.allowYield && matchKeyword('yield')) {
	            return parseYieldExpression();
	        }

	        expr = parseConditionalExpression();

	        if (expr.type === PlaceHolders.ArrowParameterPlaceHolder || match('=>')) {
	            isAssignmentTarget = isBindingElement = false;
	            list = reinterpretAsCoverFormalsList(expr);

	            if (list) {
	                firstCoverInitializedNameError = null;
	                return parseArrowFunctionExpression(list, new WrappingNode(startToken));
	            }

	            return expr;
	        }

	        if (matchAssign()) {
	            if (!isAssignmentTarget) {
	                tolerateError(Messages.InvalidLHSInAssignment);
	            }

	            // ECMA-262 12.1.1
	            if (strict && expr.type === Syntax.Identifier) {
	                if (isRestrictedWord(expr.name)) {
	                    tolerateUnexpectedToken(token, Messages.StrictLHSAssignment);
	                }
	                if (isStrictModeReservedWord(expr.name)) {
	                    tolerateUnexpectedToken(token, Messages.StrictReservedWord);
	                }
	            }

	            if (!match('=')) {
	                isAssignmentTarget = isBindingElement = false;
	            } else {
	                reinterpretExpressionAsPattern(expr);
	            }

	            token = lex();
	            right = isolateCoverGrammar(parseAssignmentExpression);
	            expr = new WrappingNode(startToken).finishAssignmentExpression(token.value, expr, right);
	            firstCoverInitializedNameError = null;
	        }

	        return expr;
	    }

	    // ECMA-262 12.15 Comma Operator

	    function parseExpression() {
	        var expr,
	            startToken = lookahead,
	            expressions;

	        expr = isolateCoverGrammar(parseAssignmentExpression);

	        if (match(',')) {
	            expressions = [expr];

	            while (startIndex < length) {
	                if (!match(',')) {
	                    break;
	                }
	                lex();
	                expressions.push(isolateCoverGrammar(parseAssignmentExpression));
	            }

	            expr = new WrappingNode(startToken).finishSequenceExpression(expressions);
	        }

	        return expr;
	    }

	    // ECMA-262 13.2 Block

	    function parseStatementListItem() {
	        if (lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	                case 'export':
	                    if (state.sourceType !== 'module') {
	                        tolerateUnexpectedToken(lookahead, Messages.IllegalExportDeclaration);
	                    }
	                    return parseExportDeclaration();
	                case 'import':
	                    if (state.sourceType !== 'module') {
	                        tolerateUnexpectedToken(lookahead, Messages.IllegalImportDeclaration);
	                    }
	                    return parseImportDeclaration();
	                case 'const':
	                    return parseLexicalDeclaration({ inFor: false });
	                case 'function':
	                    return parseFunctionDeclaration(new Node());
	                case 'class':
	                    return parseClassDeclaration();
	            }
	        }

	        if (matchKeyword('let') && isLexicalDeclaration()) {
	            return parseLexicalDeclaration({ inFor: false });
	        }

	        return parseStatement();
	    }

	    function parseStatementList() {
	        var list = [];
	        while (startIndex < length) {
	            if (match('}')) {
	                break;
	            }
	            list.push(parseStatementListItem());
	        }

	        return list;
	    }

	    function parseBlock() {
	        var block,
	            node = new Node();

	        expect('{');

	        block = parseStatementList();

	        expect('}');

	        return node.finishBlockStatement(block);
	    }

	    // ECMA-262 13.3.2 Variable Statement

	    function parseVariableIdentifier(kind) {
	        var token,
	            node = new Node();

	        token = lex();

	        if (token.type === Token.Keyword && token.value === 'yield') {
	            if (strict) {
	                tolerateUnexpectedToken(token, Messages.StrictReservedWord);
	            }if (!state.allowYield) {
	                throwUnexpectedToken(token);
	            }
	        } else if (token.type !== Token.Identifier) {
	            if (strict && token.type === Token.Keyword && isStrictModeReservedWord(token.value)) {
	                tolerateUnexpectedToken(token, Messages.StrictReservedWord);
	            } else {
	                if (strict || token.value !== 'let' || kind !== 'var') {
	                    throwUnexpectedToken(token);
	                }
	            }
	        } else if (state.sourceType === 'module' && token.type === Token.Identifier && token.value === 'await') {
	            tolerateUnexpectedToken(token);
	        }

	        return node.finishIdentifier(token.value);
	    }

	    function parseVariableDeclaration(options) {
	        var init = null,
	            id,
	            node = new Node(),
	            params = [];

	        id = parsePattern(params, 'var');

	        // ECMA-262 12.2.1
	        if (strict && isRestrictedWord(id.name)) {
	            tolerateError(Messages.StrictVarName);
	        }

	        if (match('=')) {
	            lex();
	            init = isolateCoverGrammar(parseAssignmentExpression);
	        } else if (id.type !== Syntax.Identifier && !options.inFor) {
	            expect('=');
	        }

	        return node.finishVariableDeclarator(id, init);
	    }

	    function parseVariableDeclarationList(options) {
	        var opt, list;

	        opt = { inFor: options.inFor };
	        list = [parseVariableDeclaration(opt)];

	        while (match(',')) {
	            lex();
	            list.push(parseVariableDeclaration(opt));
	        }

	        return list;
	    }

	    function parseVariableStatement(node) {
	        var declarations;

	        expectKeyword('var');

	        declarations = parseVariableDeclarationList({ inFor: false });

	        consumeSemicolon();

	        return node.finishVariableDeclaration(declarations);
	    }

	    // ECMA-262 13.3.1 Let and Const Declarations

	    function parseLexicalBinding(kind, options) {
	        var init = null,
	            id,
	            node = new Node(),
	            params = [];

	        id = parsePattern(params, kind);

	        // ECMA-262 12.2.1
	        if (strict && id.type === Syntax.Identifier && isRestrictedWord(id.name)) {
	            tolerateError(Messages.StrictVarName);
	        }

	        if (kind === 'const') {
	            if (!matchKeyword('in') && !matchContextualKeyword('of')) {
	                expect('=');
	                init = isolateCoverGrammar(parseAssignmentExpression);
	            }
	        } else if (!options.inFor && id.type !== Syntax.Identifier || match('=')) {
	            expect('=');
	            init = isolateCoverGrammar(parseAssignmentExpression);
	        }

	        return node.finishVariableDeclarator(id, init);
	    }

	    function parseBindingList(kind, options) {
	        var list = [parseLexicalBinding(kind, options)];

	        while (match(',')) {
	            lex();
	            list.push(parseLexicalBinding(kind, options));
	        }

	        return list;
	    }

	    function tokenizerState() {
	        return {
	            index: index,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            hasLineTerminator: hasLineTerminator,
	            lastIndex: lastIndex,
	            lastLineNumber: lastLineNumber,
	            lastLineStart: lastLineStart,
	            startIndex: startIndex,
	            startLineNumber: startLineNumber,
	            startLineStart: startLineStart,
	            lookahead: lookahead,
	            tokenCount: extra.tokens ? extra.tokens.length : 0
	        };
	    }

	    function resetTokenizerState(ts) {
	        index = ts.index;
	        lineNumber = ts.lineNumber;
	        lineStart = ts.lineStart;
	        hasLineTerminator = ts.hasLineTerminator;
	        lastIndex = ts.lastIndex;
	        lastLineNumber = ts.lastLineNumber;
	        lastLineStart = ts.lastLineStart;
	        startIndex = ts.startIndex;
	        startLineNumber = ts.startLineNumber;
	        startLineStart = ts.startLineStart;
	        lookahead = ts.lookahead;
	        if (extra.tokens) {
	            extra.tokens.splice(ts.tokenCount, extra.tokens.length);
	        }
	    }

	    function isLexicalDeclaration() {
	        var lexical, ts;

	        ts = tokenizerState();

	        lex();
	        lexical = lookahead.type === Token.Identifier || match('[') || match('{') || matchKeyword('let') || matchKeyword('yield');

	        resetTokenizerState(ts);

	        return lexical;
	    }

	    function parseLexicalDeclaration(options) {
	        var kind,
	            declarations,
	            node = new Node();

	        kind = lex().value;
	        assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');

	        declarations = parseBindingList(kind, options);

	        consumeSemicolon();

	        return node.finishLexicalDeclaration(declarations, kind);
	    }

	    function parseRestElement(params) {
	        var param,
	            node = new Node();

	        lex();

	        if (match('{')) {
	            throwError(Messages.ObjectPatternAsRestParameter);
	        }

	        params.push(lookahead);

	        param = parseVariableIdentifier();

	        if (match('=')) {
	            throwError(Messages.DefaultRestParameter);
	        }

	        if (!match(')')) {
	            throwError(Messages.ParameterAfterRestParameter);
	        }

	        return node.finishRestElement(param);
	    }

	    // ECMA-262 13.4 Empty Statement

	    function parseEmptyStatement(node) {
	        expect(';');
	        return node.finishEmptyStatement();
	    }

	    // ECMA-262 12.4 Expression Statement

	    function parseExpressionStatement(node) {
	        var expr = parseExpression();
	        consumeSemicolon();
	        return node.finishExpressionStatement(expr);
	    }

	    // ECMA-262 13.6 If statement

	    function parseIfStatement(node) {
	        var test, consequent, alternate;

	        expectKeyword('if');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        consequent = parseStatement();

	        if (matchKeyword('else')) {
	            lex();
	            alternate = parseStatement();
	        } else {
	            alternate = null;
	        }

	        return node.finishIfStatement(test, consequent, alternate);
	    }

	    // ECMA-262 13.7 Iteration Statements

	    function parseDoWhileStatement(node) {
	        var body, test, oldInIteration;

	        expectKeyword('do');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        if (match(';')) {
	            lex();
	        }

	        return node.finishDoWhileStatement(body, test);
	    }

	    function parseWhileStatement(node) {
	        var test, body, oldInIteration;

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        return node.finishWhileStatement(test, body);
	    }

	    function parseForStatement(node) {
	        var init,
	            forIn,
	            initSeq,
	            initStartToken,
	            test,
	            update,
	            left,
	            right,
	            kind,
	            declarations,
	            body,
	            oldInIteration,
	            previousAllowIn = state.allowIn;

	        init = test = update = null;
	        forIn = true;

	        expectKeyword('for');

	        expect('(');

	        if (match(';')) {
	            lex();
	        } else {
	            if (matchKeyword('var')) {
	                init = new Node();
	                lex();

	                state.allowIn = false;
	                declarations = parseVariableDeclarationList({ inFor: true });
	                state.allowIn = previousAllowIn;

	                if (declarations.length === 1 && matchKeyword('in')) {
	                    init = init.finishVariableDeclaration(declarations);
	                    lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                } else if (declarations.length === 1 && declarations[0].init === null && matchContextualKeyword('of')) {
	                    init = init.finishVariableDeclaration(declarations);
	                    lex();
	                    left = init;
	                    right = parseAssignmentExpression();
	                    init = null;
	                    forIn = false;
	                } else {
	                    init = init.finishVariableDeclaration(declarations);
	                    expect(';');
	                }
	            } else if (matchKeyword('const') || matchKeyword('let')) {
	                init = new Node();
	                kind = lex().value;

	                if (!strict && lookahead.value === 'in') {
	                    init = init.finishIdentifier(kind);
	                    lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                } else {
	                    state.allowIn = false;
	                    declarations = parseBindingList(kind, { inFor: true });
	                    state.allowIn = previousAllowIn;

	                    if (declarations.length === 1 && declarations[0].init === null && matchKeyword('in')) {
	                        init = init.finishLexicalDeclaration(declarations, kind);
	                        lex();
	                        left = init;
	                        right = parseExpression();
	                        init = null;
	                    } else if (declarations.length === 1 && declarations[0].init === null && matchContextualKeyword('of')) {
	                        init = init.finishLexicalDeclaration(declarations, kind);
	                        lex();
	                        left = init;
	                        right = parseAssignmentExpression();
	                        init = null;
	                        forIn = false;
	                    } else {
	                        consumeSemicolon();
	                        init = init.finishLexicalDeclaration(declarations, kind);
	                    }
	                }
	            } else {
	                initStartToken = lookahead;
	                state.allowIn = false;
	                init = inheritCoverGrammar(parseAssignmentExpression);
	                state.allowIn = previousAllowIn;

	                if (matchKeyword('in')) {
	                    if (!isAssignmentTarget) {
	                        tolerateError(Messages.InvalidLHSInForIn);
	                    }

	                    lex();
	                    reinterpretExpressionAsPattern(init);
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                } else if (matchContextualKeyword('of')) {
	                    if (!isAssignmentTarget) {
	                        tolerateError(Messages.InvalidLHSInForLoop);
	                    }

	                    lex();
	                    reinterpretExpressionAsPattern(init);
	                    left = init;
	                    right = parseAssignmentExpression();
	                    init = null;
	                    forIn = false;
	                } else {
	                    if (match(',')) {
	                        initSeq = [init];
	                        while (match(',')) {
	                            lex();
	                            initSeq.push(isolateCoverGrammar(parseAssignmentExpression));
	                        }
	                        init = new WrappingNode(initStartToken).finishSequenceExpression(initSeq);
	                    }
	                    expect(';');
	                }
	            }
	        }

	        if (typeof left === 'undefined') {

	            if (!match(';')) {
	                test = parseExpression();
	            }
	            expect(';');

	            if (!match(')')) {
	                update = parseExpression();
	            }
	        }

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = isolateCoverGrammar(parseStatement);

	        state.inIteration = oldInIteration;

	        return typeof left === 'undefined' ? node.finishForStatement(init, test, update, body) : forIn ? node.finishForInStatement(left, right, body) : node.finishForOfStatement(left, right, body);
	    }

	    // ECMA-262 13.8 The continue statement

	    function parseContinueStatement(node) {
	        var label = null,
	            key;

	        expectKeyword('continue');

	        // Optimize the most common form: 'continue;'.
	        if (source.charCodeAt(startIndex) === 0x3B) {
	            lex();

	            if (!state.inIteration) {
	                throwError(Messages.IllegalContinue);
	            }

	            return node.finishContinueStatement(null);
	        }

	        if (hasLineTerminator) {
	            if (!state.inIteration) {
	                throwError(Messages.IllegalContinue);
	            }

	            return node.finishContinueStatement(null);
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            key = '$' + label.name;
	            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError(Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !state.inIteration) {
	            throwError(Messages.IllegalContinue);
	        }

	        return node.finishContinueStatement(label);
	    }

	    // ECMA-262 13.9 The break statement

	    function parseBreakStatement(node) {
	        var label = null,
	            key;

	        expectKeyword('break');

	        // Catch the very common case first: immediately a semicolon (U+003B).
	        if (source.charCodeAt(lastIndex) === 0x3B) {
	            lex();

	            if (!(state.inIteration || state.inSwitch)) {
	                throwError(Messages.IllegalBreak);
	            }

	            return node.finishBreakStatement(null);
	        }

	        if (hasLineTerminator) {
	            if (!(state.inIteration || state.inSwitch)) {
	                throwError(Messages.IllegalBreak);
	            }
	        } else if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            key = '$' + label.name;
	            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError(Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !(state.inIteration || state.inSwitch)) {
	            throwError(Messages.IllegalBreak);
	        }

	        return node.finishBreakStatement(label);
	    }

	    // ECMA-262 13.10 The return statement

	    function parseReturnStatement(node) {
	        var argument = null;

	        expectKeyword('return');

	        if (!state.inFunctionBody) {
	            tolerateError(Messages.IllegalReturn);
	        }

	        // 'return' followed by a space and an identifier is very common.
	        if (source.charCodeAt(lastIndex) === 0x20) {
	            if (isIdentifierStart(source.charCodeAt(lastIndex + 1))) {
	                argument = parseExpression();
	                consumeSemicolon();
	                return node.finishReturnStatement(argument);
	            }
	        }

	        if (hasLineTerminator) {
	            // HACK
	            return node.finishReturnStatement(null);
	        }

	        if (!match(';')) {
	            if (!match('}') && lookahead.type !== Token.EOF) {
	                argument = parseExpression();
	            }
	        }

	        consumeSemicolon();

	        return node.finishReturnStatement(argument);
	    }

	    // ECMA-262 13.11 The with statement

	    function parseWithStatement(node) {
	        var object, body;

	        if (strict) {
	            tolerateError(Messages.StrictModeWith);
	        }

	        expectKeyword('with');

	        expect('(');

	        object = parseExpression();

	        expect(')');

	        body = parseStatement();

	        return node.finishWithStatement(object, body);
	    }

	    // ECMA-262 13.12 The switch statement

	    function parseSwitchCase() {
	        var test,
	            consequent = [],
	            statement,
	            node = new Node();

	        if (matchKeyword('default')) {
	            lex();
	            test = null;
	        } else {
	            expectKeyword('case');
	            test = parseExpression();
	        }
	        expect(':');

	        while (startIndex < length) {
	            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
	                break;
	            }
	            statement = parseStatementListItem();
	            consequent.push(statement);
	        }

	        return node.finishSwitchCase(test, consequent);
	    }

	    function parseSwitchStatement(node) {
	        var discriminant, cases, clause, oldInSwitch, defaultFound;

	        expectKeyword('switch');

	        expect('(');

	        discriminant = parseExpression();

	        expect(')');

	        expect('{');

	        cases = [];

	        if (match('}')) {
	            lex();
	            return node.finishSwitchStatement(discriminant, cases);
	        }

	        oldInSwitch = state.inSwitch;
	        state.inSwitch = true;
	        defaultFound = false;

	        while (startIndex < length) {
	            if (match('}')) {
	                break;
	            }
	            clause = parseSwitchCase();
	            if (clause.test === null) {
	                if (defaultFound) {
	                    throwError(Messages.MultipleDefaultsInSwitch);
	                }
	                defaultFound = true;
	            }
	            cases.push(clause);
	        }

	        state.inSwitch = oldInSwitch;

	        expect('}');

	        return node.finishSwitchStatement(discriminant, cases);
	    }

	    // ECMA-262 13.14 The throw statement

	    function parseThrowStatement(node) {
	        var argument;

	        expectKeyword('throw');

	        if (hasLineTerminator) {
	            throwError(Messages.NewlineAfterThrow);
	        }

	        argument = parseExpression();

	        consumeSemicolon();

	        return node.finishThrowStatement(argument);
	    }

	    // ECMA-262 13.15 The try statement

	    function parseCatchClause() {
	        var param,
	            params = [],
	            paramMap = {},
	            key,
	            i,
	            body,
	            node = new Node();

	        expectKeyword('catch');

	        expect('(');
	        if (match(')')) {
	            throwUnexpectedToken(lookahead);
	        }

	        param = parsePattern(params);
	        for (i = 0; i < params.length; i++) {
	            key = '$' + params[i].value;
	            if (Object.prototype.hasOwnProperty.call(paramMap, key)) {
	                tolerateError(Messages.DuplicateBinding, params[i].value);
	            }
	            paramMap[key] = true;
	        }

	        // ECMA-262 12.14.1
	        if (strict && isRestrictedWord(param.name)) {
	            tolerateError(Messages.StrictCatchVariable);
	        }

	        expect(')');
	        body = parseBlock();
	        return node.finishCatchClause(param, body);
	    }

	    function parseTryStatement(node) {
	        var block,
	            handler = null,
	            finalizer = null;

	        expectKeyword('try');

	        block = parseBlock();

	        if (matchKeyword('catch')) {
	            handler = parseCatchClause();
	        }

	        if (matchKeyword('finally')) {
	            lex();
	            finalizer = parseBlock();
	        }

	        if (!handler && !finalizer) {
	            throwError(Messages.NoCatchOrFinally);
	        }

	        return node.finishTryStatement(block, handler, finalizer);
	    }

	    // ECMA-262 13.16 The debugger statement

	    function parseDebuggerStatement(node) {
	        expectKeyword('debugger');

	        consumeSemicolon();

	        return node.finishDebuggerStatement();
	    }

	    // 13 Statements

	    function parseStatement() {
	        var type = lookahead.type,
	            expr,
	            labeledBody,
	            key,
	            node;

	        if (type === Token.EOF) {
	            throwUnexpectedToken(lookahead);
	        }

	        if (type === Token.Punctuator && lookahead.value === '{') {
	            return parseBlock();
	        }
	        isAssignmentTarget = isBindingElement = true;
	        node = new Node();

	        if (type === Token.Punctuator) {
	            switch (lookahead.value) {
	                case ';':
	                    return parseEmptyStatement(node);
	                case '(':
	                    return parseExpressionStatement(node);
	                default:
	                    break;
	            }
	        } else if (type === Token.Keyword) {
	            switch (lookahead.value) {
	                case 'break':
	                    return parseBreakStatement(node);
	                case 'continue':
	                    return parseContinueStatement(node);
	                case 'debugger':
	                    return parseDebuggerStatement(node);
	                case 'do':
	                    return parseDoWhileStatement(node);
	                case 'for':
	                    return parseForStatement(node);
	                case 'function':
	                    return parseFunctionDeclaration(node);
	                case 'if':
	                    return parseIfStatement(node);
	                case 'return':
	                    return parseReturnStatement(node);
	                case 'switch':
	                    return parseSwitchStatement(node);
	                case 'throw':
	                    return parseThrowStatement(node);
	                case 'try':
	                    return parseTryStatement(node);
	                case 'var':
	                    return parseVariableStatement(node);
	                case 'while':
	                    return parseWhileStatement(node);
	                case 'with':
	                    return parseWithStatement(node);
	                default:
	                    break;
	            }
	        }

	        expr = parseExpression();

	        // ECMA-262 12.12 Labelled Statements
	        if (expr.type === Syntax.Identifier && match(':')) {
	            lex();

	            key = '$' + expr.name;
	            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError(Messages.Redeclaration, 'Label', expr.name);
	            }

	            state.labelSet[key] = true;
	            labeledBody = parseStatement();
	            delete state.labelSet[key];
	            return node.finishLabeledStatement(expr, labeledBody);
	        }

	        consumeSemicolon();

	        return node.finishExpressionStatement(expr);
	    }

	    // ECMA-262 14.1 Function Definition

	    function parseFunctionSourceElements() {
	        var statement,
	            body = [],
	            token,
	            directive,
	            firstRestricted,
	            oldLabelSet,
	            oldInIteration,
	            oldInSwitch,
	            oldInFunctionBody,
	            node = new Node();

	        expect('{');

	        while (startIndex < length) {
	            if (lookahead.type !== Token.StringLiteral) {
	                break;
	            }
	            token = lookahead;

	            statement = parseStatementListItem();
	            body.push(statement);
	            if (statement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.start + 1, token.end - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    tolerateUnexpectedToken(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        oldLabelSet = state.labelSet;
	        oldInIteration = state.inIteration;
	        oldInSwitch = state.inSwitch;
	        oldInFunctionBody = state.inFunctionBody;

	        state.labelSet = {};
	        state.inIteration = false;
	        state.inSwitch = false;
	        state.inFunctionBody = true;

	        while (startIndex < length) {
	            if (match('}')) {
	                break;
	            }
	            body.push(parseStatementListItem());
	        }

	        expect('}');

	        state.labelSet = oldLabelSet;
	        state.inIteration = oldInIteration;
	        state.inSwitch = oldInSwitch;
	        state.inFunctionBody = oldInFunctionBody;

	        return node.finishBlockStatement(body);
	    }

	    function validateParam(options, param, name) {
	        var key = '$' + name;
	        if (strict) {
	            if (isRestrictedWord(name)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamName;
	            }
	            if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamDupe;
	            }
	        } else if (!options.firstRestricted) {
	            if (isRestrictedWord(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictParamName;
	            } else if (isStrictModeReservedWord(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictReservedWord;
	            } else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamDupe;
	            }
	        }
	        options.paramSet[key] = true;
	    }

	    function parseParam(options) {
	        var token,
	            param,
	            params = [],
	            i,
	            def;

	        token = lookahead;
	        if (token.value === '...') {
	            param = parseRestElement(params);
	            validateParam(options, param.argument, param.argument.name);
	            options.params.push(param);
	            options.defaults.push(null);
	            return false;
	        }

	        param = parsePatternWithDefault(params);
	        for (i = 0; i < params.length; i++) {
	            validateParam(options, params[i], params[i].value);
	        }

	        if (param.type === Syntax.AssignmentPattern) {
	            def = param.right;
	            param = param.left;
	            ++options.defaultCount;
	        }

	        options.params.push(param);
	        options.defaults.push(def);

	        return !match(')');
	    }

	    function parseParams(firstRestricted) {
	        var options;

	        options = {
	            params: [],
	            defaultCount: 0,
	            defaults: [],
	            firstRestricted: firstRestricted
	        };

	        expect('(');

	        if (!match(')')) {
	            options.paramSet = {};
	            while (startIndex < length) {
	                if (!parseParam(options)) {
	                    break;
	                }
	                expect(',');
	            }
	        }

	        expect(')');

	        if (options.defaultCount === 0) {
	            options.defaults = [];
	        }

	        return {
	            params: options.params,
	            defaults: options.defaults,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    }

	    function parseFunctionDeclaration(node, identifierIsOptional) {
	        var id = null,
	            params = [],
	            defaults = [],
	            body,
	            token,
	            stricted,
	            tmp,
	            firstRestricted,
	            message,
	            previousStrict,
	            isGenerator,
	            previousAllowYield;

	        previousAllowYield = state.allowYield;

	        expectKeyword('function');

	        isGenerator = match('*');
	        if (isGenerator) {
	            lex();
	        }

	        if (!identifierIsOptional || !match('(')) {
	            token = lookahead;
	            id = parseVariableIdentifier();
	            if (strict) {
	                if (isRestrictedWord(token.value)) {
	                    tolerateUnexpectedToken(token, Messages.StrictFunctionName);
	                }
	            } else {
	                if (isRestrictedWord(token.value)) {
	                    firstRestricted = token;
	                    message = Messages.StrictFunctionName;
	                } else if (isStrictModeReservedWord(token.value)) {
	                    firstRestricted = token;
	                    message = Messages.StrictReservedWord;
	                }
	            }
	        }

	        state.allowYield = !isGenerator;
	        tmp = parseParams(firstRestricted);
	        params = tmp.params;
	        defaults = tmp.defaults;
	        stricted = tmp.stricted;
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        body = parseFunctionSourceElements();
	        if (strict && firstRestricted) {
	            throwUnexpectedToken(firstRestricted, message);
	        }
	        if (strict && stricted) {
	            tolerateUnexpectedToken(stricted, message);
	        }

	        strict = previousStrict;
	        state.allowYield = previousAllowYield;

	        return node.finishFunctionDeclaration(id, params, defaults, body, isGenerator);
	    }

	    function parseFunctionExpression() {
	        var token,
	            id = null,
	            stricted,
	            firstRestricted,
	            message,
	            tmp,
	            params = [],
	            defaults = [],
	            body,
	            previousStrict,
	            node = new Node(),
	            isGenerator,
	            previousAllowYield;

	        previousAllowYield = state.allowYield;

	        expectKeyword('function');

	        isGenerator = match('*');
	        if (isGenerator) {
	            lex();
	        }

	        state.allowYield = !isGenerator;
	        if (!match('(')) {
	            token = lookahead;
	            id = !strict && !isGenerator && matchKeyword('yield') ? parseNonComputedProperty() : parseVariableIdentifier();
	            if (strict) {
	                if (isRestrictedWord(token.value)) {
	                    tolerateUnexpectedToken(token, Messages.StrictFunctionName);
	                }
	            } else {
	                if (isRestrictedWord(token.value)) {
	                    firstRestricted = token;
	                    message = Messages.StrictFunctionName;
	                } else if (isStrictModeReservedWord(token.value)) {
	                    firstRestricted = token;
	                    message = Messages.StrictReservedWord;
	                }
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        params = tmp.params;
	        defaults = tmp.defaults;
	        stricted = tmp.stricted;
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        body = parseFunctionSourceElements();
	        if (strict && firstRestricted) {
	            throwUnexpectedToken(firstRestricted, message);
	        }
	        if (strict && stricted) {
	            tolerateUnexpectedToken(stricted, message);
	        }
	        strict = previousStrict;
	        state.allowYield = previousAllowYield;

	        return node.finishFunctionExpression(id, params, defaults, body, isGenerator);
	    }

	    // ECMA-262 14.5 Class Definitions

	    function parseClassBody() {
	        var classBody,
	            token,
	            isStatic,
	            hasConstructor = false,
	            body,
	            method,
	            computed,
	            key;

	        classBody = new Node();

	        expect('{');
	        body = [];
	        while (!match('}')) {
	            if (match(';')) {
	                lex();
	            } else {
	                method = new Node();
	                token = lookahead;
	                isStatic = false;
	                computed = match('[');
	                if (match('*')) {
	                    lex();
	                } else {
	                    key = parseObjectPropertyKey();
	                    if (key.name === 'static' && (lookaheadPropertyName() || match('*'))) {
	                        token = lookahead;
	                        isStatic = true;
	                        computed = match('[');
	                        if (match('*')) {
	                            lex();
	                        } else {
	                            key = parseObjectPropertyKey();
	                        }
	                    }
	                }
	                method = tryParseMethodDefinition(token, key, computed, method);
	                if (method) {
	                    method['static'] = isStatic; // jscs:ignore requireDotNotation
	                    if (method.kind === 'init') {
	                        method.kind = 'method';
	                    }
	                    if (!isStatic) {
	                        if (!method.computed && (method.key.name || method.key.value.toString()) === 'constructor') {
	                            if (method.kind !== 'method' || !method.method || method.value.generator) {
	                                throwUnexpectedToken(token, Messages.ConstructorSpecialMethod);
	                            }
	                            if (hasConstructor) {
	                                throwUnexpectedToken(token, Messages.DuplicateConstructor);
	                            } else {
	                                hasConstructor = true;
	                            }
	                            method.kind = 'constructor';
	                        }
	                    } else {
	                        if (!method.computed && (method.key.name || method.key.value.toString()) === 'prototype') {
	                            throwUnexpectedToken(token, Messages.StaticPrototype);
	                        }
	                    }
	                    method.type = Syntax.MethodDefinition;
	                    delete method.method;
	                    delete method.shorthand;
	                    body.push(method);
	                } else {
	                    throwUnexpectedToken(lookahead);
	                }
	            }
	        }
	        lex();
	        return classBody.finishClassBody(body);
	    }

	    function parseClassDeclaration(identifierIsOptional) {
	        var id = null,
	            superClass = null,
	            classNode = new Node(),
	            classBody,
	            previousStrict = strict;
	        strict = true;

	        expectKeyword('class');

	        if (!identifierIsOptional || lookahead.type === Token.Identifier) {
	            id = parseVariableIdentifier();
	        }

	        if (matchKeyword('extends')) {
	            lex();
	            superClass = isolateCoverGrammar(parseLeftHandSideExpressionAllowCall);
	        }
	        classBody = parseClassBody();
	        strict = previousStrict;

	        return classNode.finishClassDeclaration(id, superClass, classBody);
	    }

	    function parseClassExpression() {
	        var id = null,
	            superClass = null,
	            classNode = new Node(),
	            classBody,
	            previousStrict = strict;
	        strict = true;

	        expectKeyword('class');

	        if (lookahead.type === Token.Identifier) {
	            id = parseVariableIdentifier();
	        }

	        if (matchKeyword('extends')) {
	            lex();
	            superClass = isolateCoverGrammar(parseLeftHandSideExpressionAllowCall);
	        }
	        classBody = parseClassBody();
	        strict = previousStrict;

	        return classNode.finishClassExpression(id, superClass, classBody);
	    }

	    // ECMA-262 15.2 Modules

	    function parseModuleSpecifier() {
	        var node = new Node();

	        if (lookahead.type !== Token.StringLiteral) {
	            throwError(Messages.InvalidModuleSpecifier);
	        }
	        return node.finishLiteral(lex());
	    }

	    // ECMA-262 15.2.3 Exports

	    function parseExportSpecifier() {
	        var exported,
	            local,
	            node = new Node(),
	            def;
	        if (matchKeyword('default')) {
	            // export {default} from 'something';
	            def = new Node();
	            lex();
	            local = def.finishIdentifier('default');
	        } else {
	            local = parseVariableIdentifier();
	        }
	        if (matchContextualKeyword('as')) {
	            lex();
	            exported = parseNonComputedProperty();
	        }
	        return node.finishExportSpecifier(local, exported);
	    }

	    function parseExportNamedDeclaration(node) {
	        var declaration = null,
	            isExportFromIdentifier,
	            src = null,
	            specifiers = [];

	        // non-default export
	        if (lookahead.type === Token.Keyword) {
	            // covers:
	            // export var f = 1;
	            switch (lookahead.value) {
	                case 'let':
	                case 'const':
	                    declaration = parseLexicalDeclaration({ inFor: false });
	                    return node.finishExportNamedDeclaration(declaration, specifiers, null);
	                case 'var':
	                case 'class':
	                case 'function':
	                    declaration = parseStatementListItem();
	                    return node.finishExportNamedDeclaration(declaration, specifiers, null);
	            }
	        }

	        expect('{');
	        while (!match('}')) {
	            isExportFromIdentifier = isExportFromIdentifier || matchKeyword('default');
	            specifiers.push(parseExportSpecifier());
	            if (!match('}')) {
	                expect(',');
	                if (match('}')) {
	                    break;
	                }
	            }
	        }
	        expect('}');

	        if (matchContextualKeyword('from')) {
	            // covering:
	            // export {default} from 'foo';
	            // export {foo} from 'foo';
	            lex();
	            src = parseModuleSpecifier();
	            consumeSemicolon();
	        } else if (isExportFromIdentifier) {
	            // covering:
	            // export {default}; // missing fromClause
	            throwError(lookahead.value ? Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	        } else {
	            // cover
	            // export {foo};
	            consumeSemicolon();
	        }
	        return node.finishExportNamedDeclaration(declaration, specifiers, src);
	    }

	    function parseExportDefaultDeclaration(node) {
	        var declaration = null,
	            expression = null;

	        // covers:
	        // export default ...
	        expectKeyword('default');

	        if (matchKeyword('function')) {
	            // covers:
	            // export default function foo () {}
	            // export default function () {}
	            declaration = parseFunctionDeclaration(new Node(), true);
	            return node.finishExportDefaultDeclaration(declaration);
	        }
	        if (matchKeyword('class')) {
	            declaration = parseClassDeclaration(true);
	            return node.finishExportDefaultDeclaration(declaration);
	        }

	        if (matchContextualKeyword('from')) {
	            throwError(Messages.UnexpectedToken, lookahead.value);
	        }

	        // covers:
	        // export default {};
	        // export default [];
	        // export default (1 + 2);
	        if (match('{')) {
	            expression = parseObjectInitializer();
	        } else if (match('[')) {
	            expression = parseArrayInitializer();
	        } else {
	            expression = parseAssignmentExpression();
	        }
	        consumeSemicolon();
	        return node.finishExportDefaultDeclaration(expression);
	    }

	    function parseExportAllDeclaration(node) {
	        var src;

	        // covers:
	        // export * from 'foo';
	        expect('*');
	        if (!matchContextualKeyword('from')) {
	            throwError(lookahead.value ? Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	        }
	        lex();
	        src = parseModuleSpecifier();
	        consumeSemicolon();

	        return node.finishExportAllDeclaration(src);
	    }

	    function parseExportDeclaration() {
	        var node = new Node();
	        if (state.inFunctionBody) {
	            throwError(Messages.IllegalExportDeclaration);
	        }

	        expectKeyword('export');

	        if (matchKeyword('default')) {
	            return parseExportDefaultDeclaration(node);
	        }
	        if (match('*')) {
	            return parseExportAllDeclaration(node);
	        }
	        return parseExportNamedDeclaration(node);
	    }

	    // ECMA-262 15.2.2 Imports

	    function parseImportSpecifier() {
	        // import {<foo as bar>} ...;
	        var local,
	            imported,
	            node = new Node();

	        imported = parseNonComputedProperty();
	        if (matchContextualKeyword('as')) {
	            lex();
	            local = parseVariableIdentifier();
	        }

	        return node.finishImportSpecifier(local, imported);
	    }

	    function parseNamedImports() {
	        var specifiers = [];
	        // {foo, bar as bas}
	        expect('{');
	        while (!match('}')) {
	            specifiers.push(parseImportSpecifier());
	            if (!match('}')) {
	                expect(',');
	                if (match('}')) {
	                    break;
	                }
	            }
	        }
	        expect('}');
	        return specifiers;
	    }

	    function parseImportDefaultSpecifier() {
	        // import <foo> ...;
	        var local,
	            node = new Node();

	        local = parseNonComputedProperty();

	        return node.finishImportDefaultSpecifier(local);
	    }

	    function parseImportNamespaceSpecifier() {
	        // import <* as foo> ...;
	        var local,
	            node = new Node();

	        expect('*');
	        if (!matchContextualKeyword('as')) {
	            throwError(Messages.NoAsAfterImportNamespace);
	        }
	        lex();
	        local = parseNonComputedProperty();

	        return node.finishImportNamespaceSpecifier(local);
	    }

	    function parseImportDeclaration() {
	        var specifiers = [],
	            src,
	            node = new Node();

	        if (state.inFunctionBody) {
	            throwError(Messages.IllegalImportDeclaration);
	        }

	        expectKeyword('import');

	        if (lookahead.type === Token.StringLiteral) {
	            // import 'foo';
	            src = parseModuleSpecifier();
	        } else {

	            if (match('{')) {
	                // import {bar}
	                specifiers = specifiers.concat(parseNamedImports());
	            } else if (match('*')) {
	                // import * as foo
	                specifiers.push(parseImportNamespaceSpecifier());
	            } else if (isIdentifierName(lookahead) && !matchKeyword('default')) {
	                // import foo
	                specifiers.push(parseImportDefaultSpecifier());
	                if (match(',')) {
	                    lex();
	                    if (match('*')) {
	                        // import foo, * as foo
	                        specifiers.push(parseImportNamespaceSpecifier());
	                    } else if (match('{')) {
	                        // import foo, {bar}
	                        specifiers = specifiers.concat(parseNamedImports());
	                    } else {
	                        throwUnexpectedToken(lookahead);
	                    }
	                }
	            } else {
	                throwUnexpectedToken(lex());
	            }

	            if (!matchContextualKeyword('from')) {
	                throwError(lookahead.value ? Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	            }
	            lex();
	            src = parseModuleSpecifier();
	        }

	        consumeSemicolon();
	        return node.finishImportDeclaration(specifiers, src);
	    }

	    // ECMA-262 15.1 Scripts

	    function parseScriptBody() {
	        var statement,
	            body = [],
	            token,
	            directive,
	            firstRestricted;

	        while (startIndex < length) {
	            token = lookahead;
	            if (token.type !== Token.StringLiteral) {
	                break;
	            }

	            statement = parseStatementListItem();
	            body.push(statement);
	            if (statement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.start + 1, token.end - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    tolerateUnexpectedToken(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        while (startIndex < length) {
	            statement = parseStatementListItem();
	            /* istanbul ignore if */
	            if (typeof statement === 'undefined') {
	                break;
	            }
	            body.push(statement);
	        }
	        return body;
	    }

	    function parseProgram() {
	        var body, node;

	        peek();
	        node = new Node();

	        body = parseScriptBody();
	        return node.finishProgram(body, state.sourceType);
	    }

	    function filterTokenLocation() {
	        var i,
	            entry,
	            token,
	            tokens = [];

	        for (i = 0; i < extra.tokens.length; ++i) {
	            entry = extra.tokens[i];
	            token = {
	                type: entry.type,
	                value: entry.value
	            };
	            if (entry.regex) {
	                token.regex = {
	                    pattern: entry.regex.pattern,
	                    flags: entry.regex.flags
	                };
	            }
	            if (extra.range) {
	                token.range = entry.range;
	            }
	            if (extra.loc) {
	                token.loc = entry.loc;
	            }
	            tokens.push(token);
	        }

	        extra.tokens = tokens;
	    }

	    function tokenize(code, options, delegate) {
	        var toString, tokens;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        source = code;
	        index = 0;
	        lineNumber = source.length > 0 ? 1 : 0;
	        lineStart = 0;
	        startIndex = index;
	        startLineNumber = lineNumber;
	        startLineStart = lineStart;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowIn: true,
	            allowYield: true,
	            labelSet: {},
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1,
	            curlyStack: []
	        };

	        extra = {};

	        // Options matching.
	        options = options || {};

	        // Of course we collect tokens here.
	        options.tokens = true;
	        extra.tokens = [];
	        extra.tokenValues = [];
	        extra.tokenize = true;
	        extra.delegate = delegate;

	        // The following two fields are necessary to compute the Regex tokens.
	        extra.openParenToken = -1;
	        extra.openCurlyToken = -1;

	        extra.range = typeof options.range === 'boolean' && options.range;
	        extra.loc = typeof options.loc === 'boolean' && options.loc;

	        if (typeof options.comment === 'boolean' && options.comment) {
	            extra.comments = [];
	        }
	        if (typeof options.tolerant === 'boolean' && options.tolerant) {
	            extra.errors = [];
	        }

	        try {
	            peek();
	            if (lookahead.type === Token.EOF) {
	                return extra.tokens;
	            }

	            lex();
	            while (lookahead.type !== Token.EOF) {
	                try {
	                    lex();
	                } catch (lexError) {
	                    if (extra.errors) {
	                        recordError(lexError);
	                        // We have to break on the first error
	                        // to avoid infinite loops.
	                        break;
	                    } else {
	                        throw lexError;
	                    }
	                }
	            }

	            tokens = extra.tokens;
	            if (typeof extra.errors !== 'undefined') {
	                tokens.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            extra = {};
	        }
	        return tokens;
	    }

	    function parse(code, options) {
	        var program, toString;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        source = code;
	        index = 0;
	        lineNumber = source.length > 0 ? 1 : 0;
	        lineStart = 0;
	        startIndex = index;
	        startLineNumber = lineNumber;
	        startLineStart = lineStart;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowIn: true,
	            allowYield: true,
	            labelSet: {},
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1,
	            curlyStack: [],
	            sourceType: 'script'
	        };
	        strict = false;

	        extra = {};
	        if (typeof options !== 'undefined') {
	            extra.range = typeof options.range === 'boolean' && options.range;
	            extra.loc = typeof options.loc === 'boolean' && options.loc;
	            extra.attachComment = typeof options.attachComment === 'boolean' && options.attachComment;

	            if (extra.loc && options.source !== null && options.source !== undefined) {
	                extra.source = toString(options.source);
	            }

	            if (typeof options.tokens === 'boolean' && options.tokens) {
	                extra.tokens = [];
	            }
	            if (typeof options.comment === 'boolean' && options.comment) {
	                extra.comments = [];
	            }
	            if (typeof options.tolerant === 'boolean' && options.tolerant) {
	                extra.errors = [];
	            }
	            if (extra.attachComment) {
	                extra.range = true;
	                extra.comments = [];
	                extra.bottomRightStack = [];
	                extra.trailingComments = [];
	                extra.leadingComments = [];
	            }
	            if (options.sourceType === 'module') {
	                // very restrictive condition for now
	                state.sourceType = options.sourceType;
	                strict = true;
	            }
	        }

	        try {
	            program = parseProgram();
	            if (typeof extra.comments !== 'undefined') {
	                program.comments = extra.comments;
	            }
	            if (typeof extra.tokens !== 'undefined') {
	                filterTokenLocation();
	                program.tokens = extra.tokens;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                program.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            extra = {};
	        }

	        return program;
	    }

	    // Sync with *.json manifests.
	    exports.version = '2.7.3';

	    exports.tokenize = tokenize;

	    exports.parse = parse;

	    // Deep copy.
	    /* istanbul ignore next */
	    exports.Syntax = function () {
	        var name,
	            types = {};

	        if (typeof Object.create === 'function') {
	            types = Object.create(null);
	        }

	        for (name in Syntax) {
	            if (Syntax.hasOwnProperty(name)) {
	                types[name] = Syntax[name];
	            }
	        }

	        if (typeof Object.freeze === 'function') {
	            Object.freeze(types);
	        }

	        return types;
	    }();
	});
	/* vim: set sw=4 ts=4 et tw=80 : */

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*eslint-disable no-use-before-define*/

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var common = __webpack_require__(7);
	var YAMLException = __webpack_require__(8);
	var DEFAULT_FULL_SCHEMA = __webpack_require__(30);
	var DEFAULT_SAFE_SCHEMA = __webpack_require__(10);

	var _toString = Object.prototype.toString;
	var _hasOwnProperty = Object.prototype.hasOwnProperty;

	var CHAR_TAB = 0x09; /* Tab */
	var CHAR_LINE_FEED = 0x0A; /* LF */
	var CHAR_SPACE = 0x20; /* Space */
	var CHAR_EXCLAMATION = 0x21; /* ! */
	var CHAR_DOUBLE_QUOTE = 0x22; /* " */
	var CHAR_SHARP = 0x23; /* # */
	var CHAR_PERCENT = 0x25; /* % */
	var CHAR_AMPERSAND = 0x26; /* & */
	var CHAR_SINGLE_QUOTE = 0x27; /* ' */
	var CHAR_ASTERISK = 0x2A; /* * */
	var CHAR_COMMA = 0x2C; /* , */
	var CHAR_MINUS = 0x2D; /* - */
	var CHAR_COLON = 0x3A; /* : */
	var CHAR_GREATER_THAN = 0x3E; /* > */
	var CHAR_QUESTION = 0x3F; /* ? */
	var CHAR_COMMERCIAL_AT = 0x40; /* @ */
	var CHAR_LEFT_SQUARE_BRACKET = 0x5B; /* [ */
	var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
	var CHAR_GRAVE_ACCENT = 0x60; /* ` */
	var CHAR_LEFT_CURLY_BRACKET = 0x7B; /* { */
	var CHAR_VERTICAL_LINE = 0x7C; /* | */
	var CHAR_RIGHT_CURLY_BRACKET = 0x7D; /* } */

	var ESCAPE_SEQUENCES = {};

	ESCAPE_SEQUENCES[0x00] = '\\0';
	ESCAPE_SEQUENCES[0x07] = '\\a';
	ESCAPE_SEQUENCES[0x08] = '\\b';
	ESCAPE_SEQUENCES[0x09] = '\\t';
	ESCAPE_SEQUENCES[0x0A] = '\\n';
	ESCAPE_SEQUENCES[0x0B] = '\\v';
	ESCAPE_SEQUENCES[0x0C] = '\\f';
	ESCAPE_SEQUENCES[0x0D] = '\\r';
	ESCAPE_SEQUENCES[0x1B] = '\\e';
	ESCAPE_SEQUENCES[0x22] = '\\"';
	ESCAPE_SEQUENCES[0x5C] = '\\\\';
	ESCAPE_SEQUENCES[0x85] = '\\N';
	ESCAPE_SEQUENCES[0xA0] = '\\_';
	ESCAPE_SEQUENCES[0x2028] = '\\L';
	ESCAPE_SEQUENCES[0x2029] = '\\P';

	var DEPRECATED_BOOLEANS_SYNTAX = ['y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON', 'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'];

	function compileStyleMap(schema, map) {
	  var result, keys, index, length, tag, style, type;

	  if (map === null) return {};

	  result = {};
	  keys = Object.keys(map);

	  for (index = 0, length = keys.length; index < length; index += 1) {
	    tag = keys[index];
	    style = String(map[tag]);

	    if (tag.slice(0, 2) === '!!') {
	      tag = 'tag:yaml.org,2002:' + tag.slice(2);
	    }
	    type = schema.compiledTypeMap['fallback'][tag];

	    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
	      style = type.styleAliases[style];
	    }

	    result[tag] = style;
	  }

	  return result;
	}

	function encodeHex(character) {
	  var string, handle, length;

	  string = character.toString(16).toUpperCase();

	  if (character <= 0xFF) {
	    handle = 'x';
	    length = 2;
	  } else if (character <= 0xFFFF) {
	    handle = 'u';
	    length = 4;
	  } else if (character <= 0xFFFFFFFF) {
	    handle = 'U';
	    length = 8;
	  } else {
	    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
	  }

	  return '\\' + handle + common.repeat('0', length - string.length) + string;
	}

	function State(options) {
	  this.schema = options['schema'] || DEFAULT_FULL_SCHEMA;
	  this.indent = Math.max(1, options['indent'] || 2);
	  this.skipInvalid = options['skipInvalid'] || false;
	  this.flowLevel = common.isNothing(options['flowLevel']) ? -1 : options['flowLevel'];
	  this.styleMap = compileStyleMap(this.schema, options['styles'] || null);
	  this.sortKeys = options['sortKeys'] || false;
	  this.lineWidth = options['lineWidth'] || 80;
	  this.noRefs = options['noRefs'] || false;
	  this.noCompatMode = options['noCompatMode'] || false;

	  this.implicitTypes = this.schema.compiledImplicit;
	  this.explicitTypes = this.schema.compiledExplicit;

	  this.tag = null;
	  this.result = '';

	  this.duplicates = [];
	  this.usedDuplicates = null;
	}

	// Indents every line in a string. Empty lines (\n only) are not indented.
	function indentString(string, spaces) {
	  var ind = common.repeat(' ', spaces),
	      position = 0,
	      next = -1,
	      result = '',
	      line,
	      length = string.length;

	  while (position < length) {
	    next = string.indexOf('\n', position);
	    if (next === -1) {
	      line = string.slice(position);
	      position = length;
	    } else {
	      line = string.slice(position, next + 1);
	      position = next + 1;
	    }

	    if (line.length && line !== '\n') result += ind;

	    result += line;
	  }

	  return result;
	}

	function generateNextLine(state, level) {
	  return '\n' + common.repeat(' ', state.indent * level);
	}

	function testImplicitResolving(state, str) {
	  var index, length, type;

	  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
	    type = state.implicitTypes[index];

	    if (type.resolve(str)) {
	      return true;
	    }
	  }

	  return false;
	}

	// [33] s-white ::= s-space | s-tab
	function isWhitespace(c) {
	  return c === CHAR_SPACE || c === CHAR_TAB;
	}

	// Returns true if the character can be printed without escaping.
	// From YAML 1.2: "any allowed characters known to be non-printable
	// should also be escaped. [However,] This isn’t mandatory"
	// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
	function isPrintable(c) {
	  return 0x00020 <= c && c <= 0x00007E || 0x000A1 <= c && c <= 0x00D7FF && c !== 0x2028 && c !== 0x2029 || 0x0E000 <= c && c <= 0x00FFFD && c !== 0xFEFF /* BOM */ || 0x10000 <= c && c <= 0x10FFFF;
	}

	// Simplified test for values allowed after the first character in plain style.
	function isPlainSafe(c) {
	  // Uses a subset of nb-char - c-flow-indicator - ":" - "#"
	  // where nb-char ::= c-printable - b-char - c-byte-order-mark.
	  return isPrintable(c) && c !== 0xFEFF
	  // - c-flow-indicator
	  && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET
	  // - ":" - "#"
	  && c !== CHAR_COLON && c !== CHAR_SHARP;
	}

	// Simplified test for values allowed as the first character in plain style.
	function isPlainSafeFirst(c) {
	  // Uses a subset of ns-char - c-indicator
	  // where ns-char = nb-char - s-white.
	  return isPrintable(c) && c !== 0xFEFF && !isWhitespace(c) // - s-white
	  // - (c-indicator ::=
	  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
	  && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET
	  // | “#” | “&” | “*” | “!” | “|” | “>” | “'” | “"”
	  && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE
	  // | “%” | “@” | “`”)
	  && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
	}

	var STYLE_PLAIN = 1,
	    STYLE_SINGLE = 2,
	    STYLE_LITERAL = 3,
	    STYLE_FOLDED = 4,
	    STYLE_DOUBLE = 5;

	// Determines which scalar styles are possible and returns the preferred style.
	// lineWidth = -1 => no limit.
	// Pre-conditions: str.length > 0.
	// Post-conditions:
	//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
	//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
	//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
	function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
	  var i;
	  var char;
	  var hasLineBreak = false;
	  var hasFoldableLine = false; // only checked if shouldTrackWidth
	  var shouldTrackWidth = lineWidth !== -1;
	  var previousLineBreak = -1; // count the first line correctly
	  var plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));

	  if (singleLineOnly) {
	    // Case: no block styles.
	    // Check for disallowed characters to rule out plain and single.
	    for (i = 0; i < string.length; i++) {
	      char = string.charCodeAt(i);
	      if (!isPrintable(char)) {
	        return STYLE_DOUBLE;
	      }
	      plain = plain && isPlainSafe(char);
	    }
	  } else {
	    // Case: block styles permitted.
	    for (i = 0; i < string.length; i++) {
	      char = string.charCodeAt(i);
	      if (char === CHAR_LINE_FEED) {
	        hasLineBreak = true;
	        // Check if any line can be folded.
	        if (shouldTrackWidth) {
	          hasFoldableLine = hasFoldableLine ||
	          // Foldable line = too long, and not more-indented.
	          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
	          previousLineBreak = i;
	        }
	      } else if (!isPrintable(char)) {
	        return STYLE_DOUBLE;
	      }
	      plain = plain && isPlainSafe(char);
	    }
	    // in case the end is missing a \n
	    hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
	  }
	  // Although every style can represent \n without escaping, prefer block styles
	  // for multiline, since they're more readable and they don't add empty lines.
	  // Also prefer folding a super-long line.
	  if (!hasLineBreak && !hasFoldableLine) {
	    // Strings interpretable as another type have to be quoted;
	    // e.g. the string 'true' vs. the boolean true.
	    return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
	  }
	  // Edge case: block indentation indicator can only have one digit.
	  if (string[0] === ' ' && indentPerLevel > 9) {
	    return STYLE_DOUBLE;
	  }
	  // At this point we know block styles are valid.
	  // Prefer literal style unless we want to fold.
	  return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
	}

	// Note: line breaking/folding is implemented for only the folded style.
	// NB. We drop the last trailing newline (if any) of a returned block scalar
	//  since the dumper adds its own newline. This always works:
	//    • No ending newline => unaffected; already using strip "-" chomping.
	//    • Ending newline    => removed then restored.
	//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
	function writeScalar(state, string, level, iskey) {
	  state.dump = function () {
	    if (string.length === 0) {
	      return "''";
	    }
	    if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
	      return "'" + string + "'";
	    }

	    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
	    // As indentation gets deeper, let the width decrease monotonically
	    // to the lower bound min(state.lineWidth, 40).
	    // Note that this implies
	    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
	    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
	    // This behaves better than a constant minimum width which disallows narrower options,
	    // or an indent threshold which causes the width to suddenly increase.
	    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

	    // Without knowing if keys are implicit/explicit, assume implicit for safety.
	    var singleLineOnly = iskey
	    // No block styles in flow mode.
	    || state.flowLevel > -1 && level >= state.flowLevel;
	    function testAmbiguity(string) {
	      return testImplicitResolving(state, string);
	    }

	    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
	      case STYLE_PLAIN:
	        return string;
	      case STYLE_SINGLE:
	        return "'" + string.replace(/'/g, "''") + "'";
	      case STYLE_LITERAL:
	        return '|' + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
	      case STYLE_FOLDED:
	        return '>' + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
	      case STYLE_DOUBLE:
	        return '"' + escapeString(string, lineWidth) + '"';
	      default:
	        throw new YAMLException('impossible error: invalid scalar style');
	    }
	  }();
	}

	// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
	function blockHeader(string, indentPerLevel) {
	  var indentIndicator = string[0] === ' ' ? String(indentPerLevel) : '';

	  // note the special case: the string '\n' counts as a "trailing" empty line.
	  var clip = string[string.length - 1] === '\n';
	  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
	  var chomp = keep ? '+' : clip ? '' : '-';

	  return indentIndicator + chomp + '\n';
	}

	// (See the note for writeScalar.)
	function dropEndingNewline(string) {
	  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
	}

	// Note: a long line without a suitable break point will exceed the width limit.
	// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
	function foldString(string, width) {
	  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
	  // unless they're before or after a more-indented line, or at the very
	  // beginning or end, in which case $k$ maps to $k$.
	  // Therefore, parse each chunk as newline(s) followed by a content line.
	  var lineRe = /(\n+)([^\n]*)/g;

	  // first line (possibly an empty line)
	  var result = function () {
	    var nextLF = string.indexOf('\n');
	    nextLF = nextLF !== -1 ? nextLF : string.length;
	    lineRe.lastIndex = nextLF;
	    return foldLine(string.slice(0, nextLF), width);
	  }();
	  // If we haven't reached the first content line yet, don't add an extra \n.
	  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
	  var moreIndented;

	  // rest of the lines
	  var match;
	  while (match = lineRe.exec(string)) {
	    var prefix = match[1],
	        line = match[2];
	    moreIndented = line[0] === ' ';
	    result += prefix + (!prevMoreIndented && !moreIndented && line !== '' ? '\n' : '') + foldLine(line, width);
	    prevMoreIndented = moreIndented;
	  }

	  return result;
	}

	// Greedy line breaking.
	// Picks the longest line under the limit each time,
	// otherwise settles for the shortest line over the limit.
	// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
	function foldLine(line, width) {
	  if (line === '' || line[0] === ' ') return line;

	  // Since a more-indented line adds a \n, breaks can't be followed by a space.
	  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
	  var match;
	  // start is an inclusive index. end, curr, and next are exclusive.
	  var start = 0,
	      end,
	      curr = 0,
	      next = 0;
	  var result = '';

	  // Invariants: 0 <= start <= length-1.
	  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
	  // Inside the loop:
	  //   A match implies length >= 2, so curr and next are <= length-2.
	  while (match = breakRe.exec(line)) {
	    next = match.index;
	    // maintain invariant: curr - start <= width
	    if (next - start > width) {
	      end = curr > start ? curr : next; // derive end <= length-2
	      result += '\n' + line.slice(start, end);
	      // skip the space that was output as \n
	      start = end + 1; // derive start <= length-1
	    }
	    curr = next;
	  }

	  // By the invariants, start <= length-1, so there is something left over.
	  // It is either the whole string or a part starting from non-whitespace.
	  result += '\n';
	  // Insert a break if the remainder is too long and there is a break available.
	  if (line.length - start > width && curr > start) {
	    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
	  } else {
	    result += line.slice(start);
	  }

	  return result.slice(1); // drop extra \n joiner
	}

	// Escapes a double-quoted string.
	function escapeString(string) {
	  var result = '';
	  var char;
	  var escapeSeq;

	  for (var i = 0; i < string.length; i++) {
	    char = string.charCodeAt(i);
	    escapeSeq = ESCAPE_SEQUENCES[char];
	    result += !escapeSeq && isPrintable(char) ? string[i] : escapeSeq || encodeHex(char);
	  }

	  return result;
	}

	function writeFlowSequence(state, level, object) {
	  var _result = '',
	      _tag = state.tag,
	      index,
	      length;

	  for (index = 0, length = object.length; index < length; index += 1) {
	    // Write only valid elements.
	    if (writeNode(state, level, object[index], false, false)) {
	      if (index !== 0) _result += ', ';
	      _result += state.dump;
	    }
	  }

	  state.tag = _tag;
	  state.dump = '[' + _result + ']';
	}

	function writeBlockSequence(state, level, object, compact) {
	  var _result = '',
	      _tag = state.tag,
	      index,
	      length;

	  for (index = 0, length = object.length; index < length; index += 1) {
	    // Write only valid elements.
	    if (writeNode(state, level + 1, object[index], true, true)) {
	      if (!compact || index !== 0) {
	        _result += generateNextLine(state, level);
	      }
	      _result += '- ' + state.dump;
	    }
	  }

	  state.tag = _tag;
	  state.dump = _result || '[]'; // Empty sequence if no valid values.
	}

	function writeFlowMapping(state, level, object) {
	  var _result = '',
	      _tag = state.tag,
	      objectKeyList = Object.keys(object),
	      index,
	      length,
	      objectKey,
	      objectValue,
	      pairBuffer;

	  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
	    pairBuffer = '';

	    if (index !== 0) pairBuffer += ', ';

	    objectKey = objectKeyList[index];
	    objectValue = object[objectKey];

	    if (!writeNode(state, level, objectKey, false, false)) {
	      continue; // Skip this pair because of invalid key;
	    }

	    if (state.dump.length > 1024) pairBuffer += '? ';

	    pairBuffer += state.dump + ': ';

	    if (!writeNode(state, level, objectValue, false, false)) {
	      continue; // Skip this pair because of invalid value.
	    }

	    pairBuffer += state.dump;

	    // Both key and value are valid.
	    _result += pairBuffer;
	  }

	  state.tag = _tag;
	  state.dump = '{' + _result + '}';
	}

	function writeBlockMapping(state, level, object, compact) {
	  var _result = '',
	      _tag = state.tag,
	      objectKeyList = Object.keys(object),
	      index,
	      length,
	      objectKey,
	      objectValue,
	      explicitPair,
	      pairBuffer;

	  // Allow sorting keys so that the output file is deterministic
	  if (state.sortKeys === true) {
	    // Default sorting
	    objectKeyList.sort();
	  } else if (typeof state.sortKeys === 'function') {
	    // Custom sort function
	    objectKeyList.sort(state.sortKeys);
	  } else if (state.sortKeys) {
	    // Something is wrong
	    throw new YAMLException('sortKeys must be a boolean or a function');
	  }

	  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
	    pairBuffer = '';

	    if (!compact || index !== 0) {
	      pairBuffer += generateNextLine(state, level);
	    }

	    objectKey = objectKeyList[index];
	    objectValue = object[objectKey];

	    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
	      continue; // Skip this pair because of invalid key.
	    }

	    explicitPair = state.tag !== null && state.tag !== '?' || state.dump && state.dump.length > 1024;

	    if (explicitPair) {
	      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
	        pairBuffer += '?';
	      } else {
	        pairBuffer += '? ';
	      }
	    }

	    pairBuffer += state.dump;

	    if (explicitPair) {
	      pairBuffer += generateNextLine(state, level);
	    }

	    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
	      continue; // Skip this pair because of invalid value.
	    }

	    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
	      pairBuffer += ':';
	    } else {
	      pairBuffer += ': ';
	    }

	    pairBuffer += state.dump;

	    // Both key and value are valid.
	    _result += pairBuffer;
	  }

	  state.tag = _tag;
	  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
	}

	function detectType(state, object, explicit) {
	  var _result, typeList, index, length, type, style;

	  typeList = explicit ? state.explicitTypes : state.implicitTypes;

	  for (index = 0, length = typeList.length; index < length; index += 1) {
	    type = typeList[index];

	    if ((type.instanceOf || type.predicate) && (!type.instanceOf || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {

	      state.tag = explicit ? type.tag : '?';

	      if (type.represent) {
	        style = state.styleMap[type.tag] || type.defaultStyle;

	        if (_toString.call(type.represent) === '[object Function]') {
	          _result = type.represent(object, style);
	        } else if (_hasOwnProperty.call(type.represent, style)) {
	          _result = type.represent[style](object, style);
	        } else {
	          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
	        }

	        state.dump = _result;
	      }

	      return true;
	    }
	  }

	  return false;
	}

	// Serializes `object` and writes it to global `result`.
	// Returns true on success, or false on invalid object.
	//
	function writeNode(state, level, object, block, compact, iskey) {
	  state.tag = null;
	  state.dump = object;

	  if (!detectType(state, object, false)) {
	    detectType(state, object, true);
	  }

	  var type = _toString.call(state.dump);

	  if (block) {
	    block = state.flowLevel < 0 || state.flowLevel > level;
	  }

	  var objectOrArray = type === '[object Object]' || type === '[object Array]',
	      duplicateIndex,
	      duplicate;

	  if (objectOrArray) {
	    duplicateIndex = state.duplicates.indexOf(object);
	    duplicate = duplicateIndex !== -1;
	  }

	  if (state.tag !== null && state.tag !== '?' || duplicate || state.indent !== 2 && level > 0) {
	    compact = false;
	  }

	  if (duplicate && state.usedDuplicates[duplicateIndex]) {
	    state.dump = '*ref_' + duplicateIndex;
	  } else {
	    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
	      state.usedDuplicates[duplicateIndex] = true;
	    }
	    if (type === '[object Object]') {
	      if (block && Object.keys(state.dump).length !== 0) {
	        writeBlockMapping(state, level, state.dump, compact);
	        if (duplicate) {
	          state.dump = '&ref_' + duplicateIndex + state.dump;
	        }
	      } else {
	        writeFlowMapping(state, level, state.dump);
	        if (duplicate) {
	          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
	        }
	      }
	    } else if (type === '[object Array]') {
	      if (block && state.dump.length !== 0) {
	        writeBlockSequence(state, level, state.dump, compact);
	        if (duplicate) {
	          state.dump = '&ref_' + duplicateIndex + state.dump;
	        }
	      } else {
	        writeFlowSequence(state, level, state.dump);
	        if (duplicate) {
	          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
	        }
	      }
	    } else if (type === '[object String]') {
	      if (state.tag !== '?') {
	        writeScalar(state, state.dump, level, iskey);
	      }
	    } else {
	      if (state.skipInvalid) return false;
	      throw new YAMLException('unacceptable kind of an object to dump ' + type);
	    }

	    if (state.tag !== null && state.tag !== '?') {
	      state.dump = '!<' + state.tag + '> ' + state.dump;
	    }
	  }

	  return true;
	}

	function getDuplicateReferences(object, state) {
	  var objects = [],
	      duplicatesIndexes = [],
	      index,
	      length;

	  inspectNode(object, objects, duplicatesIndexes);

	  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
	    state.duplicates.push(objects[duplicatesIndexes[index]]);
	  }
	  state.usedDuplicates = new Array(length);
	}

	function inspectNode(object, objects, duplicatesIndexes) {
	  var objectKeyList, index, length;

	  if (object !== null && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
	    index = objects.indexOf(object);
	    if (index !== -1) {
	      if (duplicatesIndexes.indexOf(index) === -1) {
	        duplicatesIndexes.push(index);
	      }
	    } else {
	      objects.push(object);

	      if (Array.isArray(object)) {
	        for (index = 0, length = object.length; index < length; index += 1) {
	          inspectNode(object[index], objects, duplicatesIndexes);
	        }
	      } else {
	        objectKeyList = Object.keys(object);

	        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
	          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
	        }
	      }
	    }
	  }
	}

	function dump(input, options) {
	  options = options || {};

	  var state = new State(options);

	  if (!state.noRefs) getDuplicateReferences(input, state);

	  if (writeNode(state, 0, input, true, true)) return state.dump + '\n';

	  return '';
	}

	function safeDump(input, options) {
	  return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
	}

	module.exports.dump = dump;
	module.exports.safeDump = safeDump;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _bracket = __webpack_require__(1);

	var _bracket2 = _interopRequireDefault(_bracket);

	var _CacheStore = __webpack_require__(37);

	var _CacheStore2 = _interopRequireDefault(_CacheStore);

	var _DiskStore = __webpack_require__(38);

	var _DiskStore2 = _interopRequireDefault(_DiskStore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var cacheStore = new _CacheStore2.default();
	var diskStore = new _DiskStore2.default();

	var LayoutHelper = function () {
	  function LayoutHelper() {
	    _classCallCheck(this, LayoutHelper);

	    this.store = cacheStore;
	  }

	  /**
	   * Renders a partial file
	   */


	  _createClass(LayoutHelper, [{
	    key: 'partial',
	    value: function partial(filepath, partialModel) {
	      var tmpl = this.store.get(filepath);
	      var template = _bracket2.default.compile(tmpl);
	      var result = template(partialModel);
	      return result;
	    }

	    /**
	     * Enables or disables the cache
	     */

	  }, {
	    key: 'enableCache',
	    value: function enableCache(enable) {
	      this.store = enable ? cacheStore : diskStore;
	    }
	  }]);

	  return LayoutHelper;
	}();

	exports.default = LayoutHelper;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _DiskStore = __webpack_require__(38);

	var _DiskStore2 = _interopRequireDefault(_DiskStore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CacheStore = function () {
	  function CacheStore() {
	    _classCallCheck(this, CacheStore);

	    this.diskStore = new _DiskStore2.default();
	    this.readCache = new Map();
	  }

	  /**
	   * Gets the file (from cache or file)
	   */


	  _createClass(CacheStore, [{
	    key: 'get',
	    value: function get(filepath) {
	      var fromCache = this.readCache.get(filepath);
	      if (fromCache) {
	        return fromCache;
	      }

	      var file = this.diskStore.get(filepath);
	      this.readCache.set(filepath, file);

	      return file;
	    }

	    /**
	     * Checks if a file exists
	     */

	  }, {
	    key: 'exist',
	    value: function exist(filepath) {
	      return this.readCache.has(filepath) || this.diskStore.exist(filepath);
	    }
	  }]);

	  return CacheStore;
	}();

	exports.default = CacheStore;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _fs = __webpack_require__(39);

	var _fs2 = _interopRequireDefault(_fs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DiskStore = function () {
	  function DiskStore() {
	    _classCallCheck(this, DiskStore);
	  }

	  _createClass(DiskStore, [{
	    key: 'get',

	    /**
	     * Gets the file (from cache or file)
	     */
	    value: function get(filepath) {
	      var raw = _fs2.default.readFileSync(filepath, 'utf8');
	      var clean = raw.replace(/^\uFEFF/, '');

	      return clean;
	    }

	    /**
	     * Checks if a file exists
	     */

	  }, {
	    key: 'exist',
	    value: function exist(filepath) {
	      return _fs2.default.existsSync(filepath);
	    }
	  }]);

	  return DiskStore;
	}();

	exports.default = DiskStore;

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LayoutDependency = function () {
	  function LayoutDependency() {
	    _classCallCheck(this, LayoutDependency);

	    this.master = null;
	    this.partials = new Map();
	  }

	  _createClass(LayoutDependency, [{
	    key: "hasMaster",
	    value: function hasMaster() {
	      return !!this.master;
	    }

	    /**
	     * Checks whether it has a circular dependency
	     */

	  }, {
	    key: "hasCircular",
	    value: function hasCircular() {
	      // TODO

	      if (this.master) {
	        return false;
	      }

	      return false;
	    }

	    /**
	     * Retrieves the list of paths
	     */

	  }, {
	    key: "getFileDependencies",
	    value: function getFileDependencies() {
	      return this.partials.reduce(function (res, p) {
	        return res.concat(p.path);
	      }, this.master ? [this.master.path] : []);
	    }
	  }]);

	  return LayoutDependency;
	}();

	exports.default = LayoutDependency;

/***/ }
/******/ ])
});
;