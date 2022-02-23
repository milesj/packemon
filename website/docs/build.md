---
title: Build
sidebar_label: build
---

Packemon was primarily designed and engineered for building packages. But what is building you ask?
Building is the process of parsing, transforming, and bundling a package's source code into
distributable and consumable files for npm, using community favorite tools like [Babel][babel] and
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

- `--addEngines` - Add Node.js and npm `engine` versions to each `package.json` when `platform` is
  `node`. Uses the `support` setting to determine the version range.
- `--addExports` - Add `exports` fields to each `package.json`, based on `api`, `bundle`, and
  `inputs`. This is an experimental Node.js feature and may not work correctly
  ([more information](https://nodejs.org/api/packages.html#packages_package_entry_points)).
- `--addFiles` - Add `files` whitelist entries to each `package.json`.
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
- `--loadConfigs` - Search and load config files for customizing Babel and Rollup.
- `--platforms`, `-p` - Only target specific `platform`s.
- `--skipPrivate` - Skip `private` packages from being built.
- `--stamp` - Stamp all `package.json`s with a release date.
- `--timeout` - Timeout in milliseconds before a build is cancelled. Defaults to no timeout.

> All filtering options support standard patterns (`foo-*`), comma separated lists (`foo,bar`), or
> both.

## How it works

When the build process is ran, Packemon will find all viable packages within the current project and
generate build artifacts. A build artifact is an output file that _will be_ distributed with the npm
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
and files list, as demonstrated below. This can further be expanded upon using the `--addEngines`,
`--addExports`, and `--addFiles` options.

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
ensure _only_ build artifacts are packaged and distributed to npm, we rely on the `package.json`
`files` property. Based on the list above, the files published to npm would be the following (pretty
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

[babel]: https://babeljs.io
[rollup]: https://rollupjs.org
