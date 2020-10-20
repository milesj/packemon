---
title: Building packages
---

The `build` command can be used to build all packages according to their configured build targets
(platform, formats, etc).

```
packemon build --checkLicenses --generateDeclaration
```

## How it works

## Options

Build supports the following command line options.

- `--addEngines` - Add Node.js and NPM `engine` versions to each `package.json` when `platform` is
  `node`. Uses the `support` setting to determine the version range.
- `--addExports` - Add `exports` fields to each `package.json` according to the respective `inputs`
  setting. This is an experimental Node.js feature and may not work correctly
  ([more information](https://nodejs.org/api/packages.html#packages_package_entry_points)).
- `--checkLicenses` - Check that packages have a valid `license` field. Will log a warning if
  invalid.
- `--concurrency` - Number of builds to run in parallel. Defaults to operating system CPU count.
- `--generateDeclaration` - Generate a single TypeScript declaration for each package according to
  the `inputs` setting. Uses
  [@microsoft/api-extractor](https://www.npmjs.com/package/@microsoft/api-extractor) to _only_
  generate the public API.
- `--skipPrivate` - Skip `private` packages from being built.
- `--timeout` - Timeout in milliseconds before a build is cancelled. Defaults to no timeout.

By default, `build` will find a `package.json` in the current working directory. To build a
different directory, pass a relative path as an argument.

```
packemon build ./some/other/path
```

## Babel configuration

All packages are parsed and transpiled with [Babel](https://babeljs.io/) (through Rollup). The
presets and plugins used are automatically determined on a package-by-package basis, by inspecting
the package's root files and respective `package.json` (and root `package.json` if using
workspaces).

### Presets

The environment preset is always enabled and configures the following.

- `@babel/preset-env`
  - Defines `modules` and `targets` based on the chosen [platform](./config.md#platforms) and
    [format](./config.md#formats).
  - Enables `spec` and disables `loose` for spec compliance.
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

### Plugins

The following plugins are enabled when one of their conditions are met.

- `@babel/plugin-proposal-decorators`
  - Enabled when package is TypeScript aware and defines `experimentalDecorators` in
    `tsconfig.json`.
- `babel-plugin-transform-async-to-promises`
  - Enabled when package [platform](./config.md#platforms) is configured to `browser`. This attempts
    to _avoid_ `regenerator-runtime` by transforming async/await to promises.
- `babel-plugin-transform-dev`
  - Always enabled. Will transform `__DEV__` to `process.env.NODE_ENV` conditionals.

## Rollup configuration

While Babel handles the parsing and transformation of source files, [Rollup](https://rollupjs.org)
bundles all entry point dependent source files into a single tree-shaken distributable file. This
vastly reduces the file size, require/import times, evaluation speed, and more.

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
- `@rollup/plugin-babel`
  - Parses and transforms source code using Babel.
  - Excludes test related files from transformation.
  - Inlines runtime helpers in the output file.
  - Generates source maps (browser only).
- `rollup-plugin-node-externals`
  - Defines `externals` based on `package.json` dependencies.
  - Includes `dependencies`, `devDependencies`, `peerDependencies`, and `optionalDependencies`.
