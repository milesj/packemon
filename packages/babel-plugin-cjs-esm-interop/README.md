# babel-plugin-cjs-esm-interop

[![Build Status](https://github.com/milesj/packemon/workflows/Build/badge.svg)](https://github.com/milesj/packemon/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/babel-plugin-cjs-esm-interop.svg)](https://www.npmjs.com/package/babel-plugin-cjs-esm-interop)
[![npm deps](https://david-dm.org/milesj/packemon.svg?path=packages/babel-plugin-cjs-esm-interop)](https://www.npmjs.com/package/babel-plugin-cjs-esm-interop)

Transform the differences between CommonJS code (`.js`, `.cjs`) and ECMAScript module code (`.mjs`),
based on the
[official Node.js documentation](https://nodejs.org/api/esm.html#esm_differences_between_es_modules_and_commonjs).

> We suggest writing your code as ESM (`.mjs`, `.ts`, `.tsx`, `.js` with module type) and compiling
> down to CJS instead of the reverse. This means using new syntax like `import.meta`, `import()`,
> etc!

```ts
// Input: cjs
const self = __filename;
```

```ts
// Output: mjs
const self = import.meta.url;
```

## Installation

```
yarn add --dev babel-plugin-cjs-esm-interop
```

Add the plugin to your root `babel.config.*` file and configure the output `format` option with
either `mjs` (default) or `cjs`.

```js
module.exports = {
	plugins: [['babel-plugin-cjs-esm-interop', { format: 'mjs' }]],
};
```

## Requirements

- Linux, OSX, Windows
- Node 12.17+

## Transforms

The following transforms and error handling are applied.

### CJS output

- `export`, `export default`
  - Will throw an error if used.
- `import.meta.url` -> `__filename`
- `path.dirname(import.meta.url)` -> `__dirname`

### MJS output

- `require()`, `require.resolve()`, `require.extensions`, `require.cache`, `exports.<name>`,
  `module.exports`, `process.env.NODE_PATH`
  - Will throw an error if used.
- `__filename` -> `import.meta.url`
- `__dirname` -> `path.dirname(import.meta.url)`

## How to's

If you want to support ESM code, you'll need to move away from certain features, in which you have a
few options.

### What to replace `require()` with?

- Use `import()` for JS files. Be aware that this is _async_ and cannot be used in the module scope
  unless top-level await is supported.
- Use the `fs` module for JSON files: `JSON.parse(fs.readFileSync(path))`
- Use `module.createRequire()`, which returns a require-like function you may use.
  [More info](https://nodejs.org/api/module.html#module_module_createrequire_filename).

### What to replace `require.resolve()` with?

- Use the [`resolve`](https://www.npmjs.com/package/resolve) npm package.
- Use `module.createRequire()`, which returns a require-like function with a resolver you may use.
  [More info](https://nodejs.org/api/module.html#module_module_createrequire_filename).
