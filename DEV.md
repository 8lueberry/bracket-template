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
│   ├── bracket.js              # Node lib
│   └── bracket.min.js          # Browser lib
├── /examples/                  # The code usage examples
│   ├── /browser/               # Browser sample code
│   └── /node/                  # Node sample code
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/                       # The source code of the application        
├── /tests/                     # The test code
│   ├── /helpers/               # Test helpers
│   ├── /specs/                 # Test specs to be run
│   ├── run.js                  # Run test in a node environment
│   └── runBrowser.js           # Run test in a browser environment
├── /tools/                     # Build automation scripts and utilities
├── .babelignore                # Babel ignore files
├── .babelrc                    # Babel config
├── .editorconfig               # IDE config (spacing...)
├── .eslintignore               # eslint ignore files
├── .eslintrc                   # eslint config
├── .gitignore                  # git ignore files
├── .nvmrc                      # NVM node version
├── .travis.yml                 # Travis test config
├── jsconfig.json               # Visual studio code config
└── package.json                # The list of 3rd party libraries and utilities
```

## Linter

It's recommended to install eslint on your IDE to get feedback when you code.

You can also manually run the linter `$ npm run lint`.

## Testing

- `$ npm test`
- `$ npm test-browser`
- `$ npm test-all`

## Distributing

- `$ npm run build` to build the distribution code for the browser and node.

### Publishing a new version

- `$ npm version 1.0.0`
- `$ npm publish`

### Patching existing version

- `$ npm patch`
- `$ npm publish`
