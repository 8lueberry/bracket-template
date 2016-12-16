# Braket-template

[![GitHub version](https://badge.fury.io/gh/danlevan%2Fbracket-template.svg)](http://badge.fury.io/gh/danlevan%2Fbracket-template)
[![npm version](https://badge.fury.io/js/bracket-template.svg)](http://badge.fury.io/js/bracket-template)

> Minimal Javascript engine compatible with node.js and frontend browser.

## TL;DR

- Javascript templating lib for node and modern browsers 
- Ultra fast, ultra small, ultra fast to learn 
- Uses `[[ ]]` by default (customizable), so plays well with `{{ }}` (Angular, Ember...)
- Blocks definition for reuse
- Layout support when using in node

## Getting started

Bracket is on npm as `bracket-template`

`$ npm i bracket-template`

Or, fork on [github](https://github.com/danlevan/bracket-template)

## Express

If you want to use bracket with express, it's recommended to use [consolidate.js](https://www.npmjs.com/package/consolidate) as it makes is easy to change engine and implements a cache.

[example](examples/node/consolidate.js)

## Node (API)

You can also use the template engine directly (for building your email templates for example).

[example](examples/node/simple.js)

## Browser

Bracket works great with modern browsers. The tests are run on the latest chrome browser (more tests to come).

[example](examples)

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

## Extras for node

When used in node, you can define a master layout and include partial files.

### Layout 

Layout declarations are done in [yaml](http://yaml.org) at the beginning of the template file.

**index.dot**

```html
---
master: master.dot
title: Index page
---

<!-- Define blocks used in master.dot -->

[[## body()
  Hello from index.dot
#]]

[[## body2()
  Hello from index.dot again
#]]
```

**master.dot**

```html
<!doctype html>
<html lang="en">
  <head>
    <title>[[= layout.title ]]</title>
  </head>
  <body>
    Hello from master.dot <br />
    [[= layout.body ]] <br />
    [[= layout.body2 ]]
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
    Hello from master.dot <br />
    Hello from index.dot <br />
    Hello from index.dot again
  </body>
</html>
```

**Pro tip**: Custom variables can be defined in the yaml (like title in the example) and used in the master.

### Partials

You can include another file in your template file.

**index.dot**

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Example</title>
  </head>
  <body>
    [[## partial('header.dot', { current: 'contact' }) ]]
  </body>
</html>
```

**header.dot**

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
  blockDef: /\[\[##\s*([\w]+)\(([\s\w,]*)\)\s*[\n]([\s\S]*?)\n\s*#]]/g,

  // extract the argument values from a function call
  // e.g. { test1: '123', test2: 456, test3: true }, 'aaa', true, {}, ''
  argValues: /\s*({[\s\S]*?}|[^,]+)/g,

  // The params to pass to the template function
  // For multiple params, comma delimited e.g. 'model,model2,model3...'
  varname: 'model',
};
```
