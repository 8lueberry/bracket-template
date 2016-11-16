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

## TL;DR

* Html templating system for nodejs and frontend
* Write HTML and execute javascript between `[[` and `]]`
* Define, call and reuse blocks (e.g. headers, footers, nav...)
