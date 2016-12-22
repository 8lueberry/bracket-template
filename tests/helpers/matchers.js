/* global window beforeEach jasmine it xit fit */

if (typeof global === 'undefined') {
  global = window; // eslint-disable-line
}

const customMatchers = {
  toAlmostEqual: (util, customEqualityTesters) => ({
    compare: (actual, expected) => {
      const cleanActual = actual
        .trim()
        .replace(/\n/g, '')
        .replace(/\s+/g, ' '); // remove extra whitespace

      const cleanExpected = expected
        .trim()
        .replace(/\n/g, '')
        .replace(/\s+/g, ' '); // remove extra whitespace

      return {
        pass: util.equals(cleanActual, cleanExpected, customEqualityTesters),
      };
    },
  }),
};

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

function addDataTableSupport() {
  function executeTest(name, fn, entries, override) {
    entries.forEach((entry) => {
      const itName = `${name} ${entry.name}`;
      const itFn = () => fn(...entry.params);
      (override || entry.proxy)(itName, itFn);
    });
  }

  global.entry = (name, ...params) => {
    const result = {
      name,
      params,
      proxy: it,
    };

    return result;
  };

  global.fentry = (name, ...params) => {
    const result = {
      name,
      params,
      proxy: fit,
    };

    return result;
  };

  global.xentry = (name, ...params) => {
    const result = {
      name,
      params,
      proxy: xit,
    };

    return result;
  };

  global.describeTable = (name, fn, ...entries) => {
    executeTest(name, fn, entries);
  };

  global.fdescribeTable = (name, fn, ...entries) => {
    executeTest(name, fn, entries, fit);
  };

  global.xdescribeTable = (name, fn, ...entries) => {
    executeTest(name, fn, entries, xit);
  };
}

addDataTableSupport();
