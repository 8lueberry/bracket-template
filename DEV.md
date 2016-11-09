# Contributing

## Machine setup

- Install `nvm`
- Install `yarn` `$ npm install -g yarn`

Make sure you have [EditorConfig](http://editorconfig.org/#download) installed for your IDE. This will ensure the same coding config accross devs. 

## Getting started

- Clone project `https://github.com/danlevan/bracket`
- Go to the project repo
- Run `nvm use`
- Run `yarn`
- Test the installation by running `npm test`

## Repo structure


```
.
├── /dist/                      # The folder for compiled output
│   ├── bracket.min.js          # Browser lib (minified)
│   └── node.js                 # Node lib
├── /examples/                  # The code usage examples
│   ├── /browser/               # Browser sample code
│   └── /node/                  # Node sample code
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/                       # The source code of the application        
├── /tests/                     # The test code
├── /tools/                     # Build automation scripts and utilities
├── .babelrc                    # ()
├── .editorconfig               # ()
├── .eslintrc                   # ()
├── .eslintignore               # ()
├── .gitignore                  # ()
├── .jscsrc                     # ()
├── .nvmrc                      # ()
├── jsconfig.json               # (visual code)
└── package.json                # The list of 3rd party libraries and utilities
```

## Linter

It's recommended to install eslint on your IDE to get feedback when you code.

You can also manually run the linter `$ npm run lint`.

## Testing

- `$ npm test`

## Distributing

- `$ npm run build` to build the distribution code for the browser and node.
