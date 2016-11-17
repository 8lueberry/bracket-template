# Braket-template

[![GitHub version](https://badge.fury.io/gh/danlevan%2Fbracket-template.svg)](http://badge.fury.io/gh/danlevan%2Fbracket-template)
[![npm version](https://badge.fury.io/js/bracket-template.svg)](http://badge.fury.io/js/bracket-template)

> Minimal Javascript engine compatible with node.js and frontend browser.

## Features

- Ultrafast
- Learn in 1 minute
- Uses `[[ ]]` by default, so plays well with `{{ }}` (Angular, Ember...)
- Blocks for reuse
- Compatible with node (including express) and modern browsers

## Getting started

See the [examples](examples)

## Language definition

### Javascript execution

Anything between `[[ ... ]]` is executed as javascript.
Anything bewteen `[[= ... ]]` is interpolated (i.e. print string values)

For example

```
[[ var test = 'wor'; ]]
Hello [[= test + '..ld' ]]
```

Result: `Hello wor..ld`

### Block definition

Define blocks between `[[## ... #]]`
Call blocks with `[[# ... ]]`

For example

```
Hello [[# block1('bracket') ]]

[[## block1(arg1)
  [[= arg ]] from block 1
#]]
```

Result: `Hello bracket from block 1`

### Layout (node only)

When used in node parent layouts are supported. Layout declarations are done in [yaml](http://yaml.org) at the beginning of the template file.

`master.dot`

```
<!doctype html>
<html lang="en">
  <head>
    <title>[[= layout.title ]]</title>
  </head>
  <body>
    Hello from master.dot <br />
    [[= layout.section1 ]] <br />
    [[= layout.section2 ]]
  </body>
</html>
```

`index.dot`

```
---
layout: master.dot
title: Index page
---

[[##section1:
  Hello from index.dot
#]]

[[##section2:
  Hello from index.dot again
#]]
```

`Result`

```
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

## Customization

TODO:

## TL;DR

* Html templating system for nodejs and frontend
* Write HTML and execute javascript between `[[` and `]]`
* Define, call and reuse blocks (e.g. headers, footers, nav...)
