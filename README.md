# Braket-template

[![GitHub version](https://badge.fury.io/gh/danlevan%2Fbracket-template.svg)](http://badge.fury.io/gh/danlevan%2Fbracket-template)
[![npm version](https://badge.fury.io/js/bracket-template.svg)](http://badge.fury.io/js/bracket-template)

> Minimal (über fast) Javascript engine compatible with node.js and browsers.

## TL;DR

- Javascript templating lib for node and modern browsers 
- Ultra fast, ultra small, ultra fast to learn 
- Uses `[[ ]]` by default (customizable), so plays well with `{{ }}` (Angular, Ember...)
- Define and call your own block definition (functions) for reuse
- Node: Parent layout and include files supported

## Getting started

`$ npm i bracket-template`

or 

`$ yarn add bracket-template`

or

fork on [github](https://github.com/danlevan/bracket-template)

## Express

If you want to use bracket with express, it's recommended to use [consolidate.js](https://www.npmjs.com/package/consolidate) as it makes is easy to change engine and implements a cache.

[example](examples/node/consolidate)

## Node (API)

If you want to use bracket in your node project for building your email templates for example, you can use it directly. (For Express, it's recommended to use [consolidate.js](https://www.npmjs.com/package/consolidate))

[example](examples/node/simple)

## Browser

Bracket works great with modern browsers. The tests are run on the latest chrome browser (more browser tests to come).

[example](examples/browser)

## Language definition

### Javascript execution

* Anything between `[[ ... ]]` is executed as javascript.
* Anything bewteen `[[= ... ]]` is interpolated (i.e. print string values)

For example

```
[[ var test = 'wor'; ]]
Hello [[= test + '..ld' ]]
```

→ **Result** `Hello wor..ld`

### Block definition

* Block definition `[[## someFunc(someArg...) ... #]]`
* Call blocks with `[[# someFunc(...) ]]`

For example

```html
<!-- Call block -->
Hello [[# block1('world') ]]

<!-- Block definition -->
[[## block1(arg1)
  from block1 (with '[[= arg1 ]]')
#]]
```

→ **Result** `Hello from block 1 (with 'world')`

### Helper methods

Helper methods can be passed during the compilation of the template. This is especially useful for passing a translation method for example.

Example

```javascript
var template = bracket.compile(
  "Hello world: [[# translate('Hello world') ]]",
  {
    helpers: {
      translate: function(text) {
        return 'Bonjour le monde';
      }
    }
  }
);
template();
```

→ **Result** `Hello world: Bonjour le monde`

## Extras for node

When used in node, you can define a master layout and include partial files.

### Layout 

Layout declarations are done in [yaml](http://yaml.org) at the beginning of the template file.

**index.brkt.html**

```html
---
master: master.brkt.html
title: Index page
---

<!-- Define blocks used in master.brkt.html -->

[[## body()
  Hello from index.brkt.html
#]]

[[## body2()
  Hello from index.brkt.html again
#]]
```

**master.brkt.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <title>[[= layout.title || 'default title' ]]</title>
  </head>
  <body>
    Hello from master.brkt.html <br />
    [[# body() ]] <br />
    [[# body2() ]]
  </body>
</html>
```

→ **Result**

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Index page</title>
  </head>
  <body>
    Hello from master.brkt.html <br />
    Hello from index.brkt.html <br />
    Hello from index.brkt.html again
  </body>
</html>
```

The master file specified can be
- relative to the current file `../_layout/master.brkt.html`
- relative to the views set in express `app.set('views', path.resolve(__dirname, 'views'));`

**Pro tip**
- Custom variables can be defined in the yaml (like title in the example) and used in the master.
- Default values in this format `[[= layout.title || 'default title' ]]`

### Partials

You can include another file in your template file.

**index.brkt.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Example</title>
  </head>
  <body>
    [[# partial('header.brkt.html', { current: 'contact' }) ]]
  </body>
</html>
```

**header.brkt.html**

```html
<nav>
  <ul>
    <li>Home</li>
    <li>Contact</li>
  </ul>
</nav>
```

→ **Result**

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Example</title>
  </head>
  <body>
    <nav>
      <ul>
        <li>Home</li>
        <li>Contact</li>
      </ul>
    </nav>
  </body>
</html>
```

## Customization

You can customize all the settings and regex used by bracket. 

**Default settings**

```js
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
  argValues: /\s*({[\s\S]*?}|[^,]+)/g,

  // The params to pass to the template function
  // For multiple params, comma delimited e.g. 'model,model2,model3...'
  varname: 'model',
};
```

**Pro tip** If you want to pass more than one model, change the varname to 'model, model2' and your template function will accept 2 models.
