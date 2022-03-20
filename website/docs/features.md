---
title: Features & optimizations
---

## Babel configuration

All packages are parsed and transpiled with [Babel][babel] (through Rollup). The presets and plugins
used are automatically determined on a package-by-package basis, by inspecting the package's root
files and respective `package.json` (and root `package.json` if using workspaces).

### Presets

The environment preset is always enabled and configures the following.

- `@babel/preset-env`
  - Defines `modules` and `targets` based on the chosen [platform](./config.md#platforms) and
    [format](./config.md#formats).
  - Enables `spec` in development for testing compliance.
  - Enables `bugfixes` and `shippedProposals` for smaller file sizes.
  - Disables `useBuiltIns` as consumers of the package should polyfill accordingly.

The following presets are enabled when one of their conditions are met.

- `@babel/preset-flow`
  - Package or root contains a `flow-bin` dependency.
  - Project contains a `.flowconfig`.
- `@babel/preset-typescript`
  - Package or root contains a `typescript` dependency.
  - Package contains a `tsconfig.json`.
- `@babel/preset-react`
  - Package contains a `react` dependency.
  - Enables the new [JSX transform][jsx] if the dependency range captures the minimum requirement.

### Plugins

The following plugins are enabled when one of their conditions are met.

- `@babel/plugin-proposal-decorators`
  - Enabled when package is TypeScript aware and defines `experimentalDecorators` in
    `tsconfig.json`.
- `@babel/plugin-transform-runtime`
  - Enabled when package [platform](./config.md#platforms) is configured to `browser` or `native`.
    Will transform generators to `regnerator-runtime` for legacy versions.
- `babel-plugin-transform-async-to-promises`
  - Enabled when package [platform](./config.md#platforms) is configured to `browser` or `native`.
    Will transform async/await to promises for legacy versions.
- [`babel-plugin-env-constants`](#environment-constants)
  - Always enabled. Will transform `__DEV__`, `__PROD__`, and `__TEST__` to `process.env.NODE_ENV`
    expressions.
- [`babel-plugin-conditional-invariant`](#invariant-checks)
  - Always enabled. Will wrap `invariant()` calls with `process.env.NODE_ENV` conditionals.
- [`babel-plugin-cjs-esm-interop`](#cjs--esm-interoperability)
  - Enabled when package [platform](./config.md#platforms) is configured to `node`. Will convert ESM
    code to CJS and vice-versa.

## Rollup configuration

While Babel handles the parsing and transformation of source files, [Rollup][rollup] bundles all
entry point dependent source files into a single tree-shaken distributable file. This vastly reduces
the file size, require/import times, evaluation speed, and more.

However, configuring Rollup can be quite daunting. Because of this, the entire layer is abstracted
away behind Packemon, and should just "work" when packages are configured correctly. Our abstraction
abides the following:

- For every input in a package's [inputs](./config.md#inputs) setting, an output file will be
  created.
- For every [platform](./config.md#platforms) and [format](./config.md#formats) in a package, a
  unique output file will be created.
- Every Node.js built-in module is configured as external.
- Every package dependency is configured as external.
- Always reduces file size as much as possible by utilizing tree-shaking.
- Allows input files to reference other input files to mitigate "instance of" and "reference"
  issues.

### Plugins

The following plugins are enabled per package.

- `@rollup/plugin-node-resolve`
  - Resolves imports using Node.js module resolution.
- `@rollup/plugin-commonjs`
  - Converts CommonJS externals to ECMAScript for bundling capabilities.
- `@rollup/plugin-json`
  - Allows JSON files to be imported (default export only).
- `@rollup/plugin-babel`
  - Parses and transforms source code using Babel.
  - Excludes test related files from transformation.
  - Inlines runtime helpers in the output file.
- `rollup-plugin-node-externals`
  - Defines `externals` based on `package.json` dependencies.
  - Includes `dependencies`, `devDependencies`, `peerDependencies`, and `optionalDependencies`.
- `rollup-plugin-polyfill-node`
  - Polyfills Node.js built-in modules when platform is `browser` or `native`.
- _Custom_
  - Prepend a Node.js shebang to `bin.*` output files.
  - Process imported assets and share between formats.

## Development and production targets

Packemon configures Babel internally based on `NODE_ENV`. When in development (default), code is
transpiled for spec compliance and debugging purposes, while in production for performance. We
suggest running `packemon build` for development, and `packemon pack` with environment variable for
production (before a release).

```bash
packemon build
NODE_ENV=production packemon pack
```

## Tree-shaking optimization

When a package is [bundled](./config.md#bundle), tree-shaking and pure annotations are automatically
enabled through the Rollup build. This feature also takes multiple inputs (entry points) into
account and chunks the bundled code accordingly.

## Code-splitting aware

Make use of `import()` and Packemon will ensure proper code-splitting for consumers. Packemon will
persist dynamic imports when the the target platform and supported version can utilize the feature
natively, otherwise it is transpiled down.

## React JSX transforms

[JSX][jsx] supports 2 patterns for transforming code: the `classic` pattern where
`import React from 'react'` is required, and the new `automatic` pattern where the import can be
omitted. Packemon will automatically choose a pattern based on the `react` dependency found in a
package's `package.json`, by verifying the version satisfies the minimin requirement.

The version can be defined as a `peerDependencies`:

```json
{
	"peerDependencies": {
		"react": ">=17.0.0"
	}
}
```

Or the version can be defined as a normal `dependencies`:

```json
{
	"dependencies": {
		"react": "^17.0.0"
	}
}
```

## Asset imports

When a file imports an asset
([styles, images, audio, video](https://github.com/milesj/packemon/blob/master/packages/packemon/src/constants.ts#L12)),
the import remains in-tact so any bundlers can handle accordingly. However, assets are moved to a
shared `assets` folder, are hashed for uniqueness, and any imports are modified to this new path.

An example of this as follows:

```ts
// Input:
//  src/components/Button/index.ts
//  src/components/Button/button.css
import './button.css';
```

```ts
// Output:
//  esm/components/Button/index.js
//  assets/button-as17p2k9.css
import '../../../assets/button-as17p2k9.css';
```

> UMD builds do not support asset imports!

## Environment constants

The [babel-plugin-env-constants](https://www.npmjs.com/package/babel-plugin-env-constants) plugin is
always enabled, which will transform `__DEV__`, `__PROD__`, and `__TEST__` constants to
`process.env.NODE_ENV` conditionals.

When this code is ran through a minifier like Terser, any non-production checks will be removed
through a process known as dead-code elimination. This will greatly reduce bundle size on consumers!

```ts
// Input
if (__DEV__) {
	console.log('Some message in development!');
}
```

```ts
// Output
if (process.env.NODE_ENV !== 'production') {
	console.log('Some message in development!');
}
```

If you are using TypeScript, you'll most likely need to declare the globals yourself.

```ts
declare global {
	var __DEV__: boolean;
	var __PROD__: boolean;
	var __TEST__: boolean;
}
```

## Invariant checks

The
[babel-plugin-conditional-invariant](https://www.npmjs.com/package/babel-plugin-conditional-invariant)
plugin is always enabled, which will wrap `invariant()` function checks in `process.env.NODE_ENV`
conditionals that only run in development.

When this code is ran through a minifier like Terser, all invariant checks will be removed through a
process known as dead-code elimination, just like environment constants above!

```ts
// Input
invariant(value === false, 'Value must be falsy!');
```

```ts
// Output
if (process.env.NODE_ENV !== 'production') {
	invariant(value === false, 'Value must be falsy!');
}
```

## CJS & ESM interoperability

Packemon by default encourages [ECMAScript modules](./esm.md), but not everyone is there yet. To
bridge this gap, we enable the
[babel-plugin-cjs-esm-interop](https://www.npmjs.com/package/babel-plugin-cjs-esm-interop) plugin,
which transforms CommonJS code (`.cjs`, `.js`) into ECMAScript module code (`.mjs`, `.js` with
module type), and vice versa, based on the
[official Node.js documentation](https://nodejs.org/api/esm.html#esm_differences_between_es_modules_and_commonjs).

```ts
// Input: mjs
const self = import.meta.url;
```

```ts
// Output: cjs
const self = __filename;
```

[babel]: https://babeljs.io
[rollup]: https://rollupjs.org
[jsx]: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
