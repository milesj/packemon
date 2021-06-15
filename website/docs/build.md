---
title: Build
sidebar_label: build
---

Packemon was primarily designed and engineered for building packages. But what is building you ask?
Building is the process of parsing, transforming, and bundling a package's source code into
distributable and consumable files for NPM, using community favorite tools like [Babel][babel] and
[Rollup][rollup].

With that being said, the `build` command can be used to build all packages in a project according
to their configured build targets (platform, formats, etc).

```json title="package.json"
{
	"scripts": {
		"build": "packemon build --addEngines"
	}
}
```

## Options

Build supports the following command line options.

- `--addEngines` - Add Node.js and NPM `engine` versions to each `package.json` when `platform` is
  `node`. Uses the `support` setting to determine the version range.
- `--addExports` - Add `exports` fields to each `package.json` according to the respective `inputs`
  setting. This is an experimental Node.js feature and may not work correctly
  ([more information](https://nodejs.org/api/packages.html#packages_package_entry_points)).
- `--analyze` - Analyze and visualize all generated builds. Will open a browser visualization for
  each bundle in one of the following formats.
  - `sunburst` - Displays an inner circle surrounded by rings of deeper hierarchy levels.
  - `treemap` - Displays hierarchy levels as top-level and nested rectangles of varying size.
  - `network` - Displays files as nodes with the relationship between files.
- `--concurrency` - Number of builds to run in parallel. Defaults to operating system CPU count.
- `--declaration` - Generate TypeScript declarations for each package. Accepts one of the following
  values.
  - `standard` - Generates multiple `d.ts` files with `tsc`.
  - `api` - Generates a single `d.ts` file for each input. Uses
    [@microsoft/api-extractor](https://www.npmjs.com/package/@microsoft/api-extractor) to _only_
    generate the public API. _(NOTE: this is quite slow)_
- `--declarationConfig` - Path to a custom `tsconfig` for declaration building.
- `--filter` - Filter packages to build based on their name in `package.json`.
- `--formats`, `-f` - Only generate specific output `format`s.
- `--platforms`, `-p` - Only target specific `platform`s.
- `--skipPrivate` - Skip `private` packages from being built.
- `--timeout` - Timeout in milliseconds before a build is cancelled. Defaults to no timeout.

> All filtering options support standard patterns (`foo-*`), comma separated lists (`foo,bar`), or
> both.

## How it works

When the build process is ran, Packemon will find all viable packages within the current project and
generate build artifacts. A build artifact is an output file that _will be_ distributed with the NPM
package, but _will **not** be_ committed to the project (ideally git ignored).

To demonstrate this, let's assume we have a package with the following folder structure and file
contents (not exhaustive).

```
/
├── src/
|   ├── index.ts
|   └── *.ts
├── tests/
├── package.json
├── LICENSE
└── README.md
```

```json title="package.json"
{
	"name": "package",
	"packemon": {
		"inputs": { "index": "src/index.ts" },
		"platform": ["node", "browser"],
		"formats": ["lib", "esm", "umd"],
		"namespace": "Example"
	}
}
```

Based on the package configuration above, our build will target both Node.js and web browsers, while
generating multiple `index` outputs across both platforms. The resulting folder structure will look
like the following (when also using `--declaration`).

```
/
├── dts/
|   └── index.d.ts
├── esm/
|   └── index.js
├── lib/
|   └── browser/index.js
|   └── node/index.js
├── src/
|   ├── index.ts
|   └── *.ts
├── tests/
├── umd/
|   └── index.js
├── package.json
├── LICENSE
└── README.md
```

Furthermore, the `package.json` will automatically be updated with our build artifact entry points
and files list, as demonstrated below. This can further be expanded upon using the `--addEngines`
and `--addExports` options.

```json title="package.json"
{
	"name": "package",
	"main": "./lib/index.js",
	"module": "./esm/index.js",
	"browser": "./umd/index.js",
	"types": "./dts/index.d.ts",
	"files": ["dts/", "esm/", "lib/", "src/", "umd/"],
	"packemon": {
		"inputs": { "index": "src/index.ts" },
		"platform": ["node", "browser"],
		"formats": ["lib", "esm", "umd"],
		"namespace": "Example"
	}
}
```

Amazing, we now have self-contained and tree-shaken build artifacts for consumption. However, to
ensure _only_ build artifacts are packaged and distributed to NPM, we rely on the `package.json`
`files` property. Based on the list above, the files published to NPM would be the following (pretty
much everything except tests).

```
/
├── dts/
├── esm/
├── lib/
├── src/
├── umd/
├── package.json
├── LICENSE
└── README.md
```

> Why are source files published? For source maps! Packemon will always generate source maps
> regardless of format, and the `src` directory is necessary for proper linking.

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
  - Enables `loose` in production for smaller file sizes.
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
  - Package or root contains a `react` dependency.

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
- _Custom_
  - Always enabled. Will transform `__DEV__`, `__PROD__`, and `__TEST__` to `process.env.NODE_ENV`
    conditionals.

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
- `rollup-plugin-visualizer`
  - Analyzes and generates a bundle size visualizer.
- _Custom_
  - Prepend a Node.js shebang to `bin.*` output files.

[babel]: https://babeljs.io
[rollup]: https://rollupjs.org
