# fx(hash), fx(stdio), and p5 boilerplate

A boilerplate based on the [fxhash-webpack-boilerplate](https://github.com/fxhash/fxhash-webpack-boilerplate), but with [fx(stdio)](https://github.com/alt-escapism/stdio) and p5 installed.

## Getting started

Ensure that you have [nodejs](https://nodejs.org/) installed.

Clone the repository:

```sh
git clone https://github.com/alt-escapism/fxhash-stdio-boilerplate.git your_folder && cd your_folder
```

Install:

```sh
npm i
```

Start server:

```sh
npm start
```

This last command will open up your project with fx(stdio) installed, and [live reloading](https://webpack.js.org/configuration/dev-server/#devserverlivereload) enabled, so that you can iterate faster on your projects.

## Developing with fx(stdio)

The file `src/index.js` contains sample code for getting started with fx(stdio)
and p5. This should show you how to integrate with fx(stdio). In short, import
and use the randomization functions from `@altesc/stdio`, instead of the ones
from p5. If you want a random variable to appear in the fx(stdio) UI, simply add
a unique name as the first argument to the function.

See the [fx(stdio) documentation](https://altesc.art/stdio) for more information.

## Publishing to fx(hash)

```sh
$ npm run build
```

This will prepare your bundle for publishing to fx(hash). The fx(stdio) UI will be stripped from this version.

A zip file can be found at `dist-zipped/project.zip`, which can be directly
imported on fx(hash).
