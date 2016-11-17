(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
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
	/* global window VERSION */

	var settings = {
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
	  varname: 'model'
	};

	var logger = {
	  context: function context(name) {
	    var result = {
	      debug: function debug() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        if (settings.log) {
	          var _console;

	          (_console = console).log.apply(_console, [name, ': '].concat(args));
	        }
	      }
	    };
	    return result;
	  }
	};

	function compile(tmpl, conf) {
	  var str = tmpl || '';
	  var c = Object.assign({}, settings, conf);
	  var blocks = {};

	  str = str
	  // handle section def
	  .replace(c.blockDef, function (m, name, args, body) {
	    var log = logger.context('block.def');
	    log.debug(name + ' accepting ' + args);

	    blocks[name] = {
	      args: args.split(',').map(function (a) {
	        return a.trim();
	      }),
	      body: body
	    };
	    return '';
	  })

	  // handle section call
	  .replace(c.block, function (m, name, args) {
	    var log = logger.context('block.call');

	    if (!blocks[name]) {
	      log.debug('Block doesn\'t exist');
	      return '';
	    }

	    log.debug('Calling ' + name + ' with ' + args);

	    // arg -> value
	    var argValues = [];
	    args.replace(c.argValues, function (m2, val) {
	      argValues.push(val);
	    });
	    var lookup = blocks[name].args.reduce(function (res, k, i) {
	      var hash = res;
	      hash[k] = argValues.length <= i ? undefined : argValues[i];
	      return hash;
	    }, {});

	    log.debug('Lookup args:', lookup);

	    var blockStr = blocks[name].body.replace(c.interpolate, function (m2, codeVal) {
	      var code = codeVal.trim();

	      // support obj.arg
	      var key = code.split('.')[0];
	      if (!(key in lookup)) {
	        return m2;
	      }

	      // Generate the value by making a scoped function
	      // e.g. function() { var arg = { test1: '123' }; return arg.test1; }
	      var valStr = 'var ' + key + '=' + lookup[key] + ';return ' + code + ';';
	      log.debug('Arg retrieval for ' + code + ' (' + key + ') -> ' + valStr);
	      var val = Function(valStr)(); // eslint-disable-line

	      return '\';out+=' + JSON.stringify(val) + ';out+=\'';
	    });

	    log.debug('Replaced:', blockStr);
	    return blockStr;
	  })

	  // convert models
	  .replace(c.interpolate, function (m, code) {
	    return '\';out+=' + code.trim() + ';out+=\'';
	  })

	  // raw js
	  .replace(c.evaluate, function (m, code) {
	    return '\';' + code.trim() + 'out+=\'';
	  });

	  // build the template function body
	  str = ('var out=\'' + str + '\';return out;'
	  // remove the newlines or '' will break
	  ).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '');

	  logger.context('template').debug('Generated template function:', str);
	  return new Function(c.varname, str); // eslint-disable-line
	}

	var res = {
	  version:  false ? 'test' : ("1.0.2"), // read from package.json
	  logger: logger,
	  settings: settings,
	  compile: compile
	};

	// browser
	var isBrowser = typeof window !== 'undefined';

	if (isBrowser) {
	  logger.context('global').debug('Browser context, adding to window.bracket');
	  window.bracket = res;
	} else {
	  logger.context('global').debug('Node context');
	}

	exports.default = res;

/***/ }
/******/ ])
});
;