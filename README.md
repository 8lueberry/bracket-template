# Braket

> Minimal Javascript engine compatible with node.js and frontend browser.

## Features

- Ultrafast
- Learn in 1 minute
- Uses `[[ ]]` by default, so plays well with `{{ }}` (Angular, Ember...)
- Blocks for reuse
- Compatible with node (including express) and most browsers

## Getting started

TODO:

## Language definition

### Javascript execution

Anything between `[[ ... ]]` is executed as javascript.

### Block definition

Define blocks between `[[## ... #]]`
Call blocks with `[[# ... ]]`

For example

```
Hello [[# block1('world') ]]

[[## block1(arg1)
[[= arg ]] from block 1
#]]
```

Result: `Hello world from block 1`
