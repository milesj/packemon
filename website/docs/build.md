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

- `--addEngines` - Add Node.js `engine` versions to `package.json` when `platform` is `node`. Uses
  the `support` setting to determine the version range.
- `--addExports` - Add `exports` fields to `package.json`, based on `api`, `bundle`, and `inputs`.
  This is an experimental Node.js feature and may not work correctly
  ([more information](https://nodejs.org/api/packages.html#packages_package_entry_points)).
- `--addFiles` - Add `files` whitelist entries to `package.json`.
- `--concurrency` - Number of builds to run in parallel. Defaults to operating system CPU count.
- `--declaration` - Generate TypeScript declarations for the package.
- `--filter` - Filter packages to build based on their name in `package.json`.
- `--formats`, `-f` - Only generate specific output `format`s.
- `--loadConfigs` - Search and load config files for customizing Babel and Rollup.
- `--platforms`, `-p` - Only target specific `platform`s.
- `--skipPrivate` - Skip `private` packages from being built.
- `--stamp` - Stamp all `package.json`s with a release timestamp.
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
    "format": "esm",
    "namespace": "Example"
  }
}
```

Based on the package configuration above, our build will target both Node.js and web browsers, while
generating multiple `index` outputs across both platforms. The resulting folder structure will look
like the following (when also using `--declaration`).

```
/
├── esm/
|   ├── index.d.ts
|   └── index.js
├── lib/
|   ├── index.d.ts
|   └── browser/index.js
|   └── node/index.js
├── src/
|   ├── index.ts
|   └── *.ts
├── tests/
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
  "types": "./lib/index.d.ts",
  "files": ["esm/**/*", "lib/**/*", "src/**/*"],
  "packemon": {
    "inputs": { "index": "src/index.ts" },
    "platform": ["node", "browser"],
    "format": "esm",
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
├── esm/
├── lib/
├── src/
├── package.json
├── LICENSE
└── README.md
```

> Why are source files published? For source maps! Packemon will always generate source maps
> regardless of format, and the `src` directory is necessary for proper linking.

[babel]: https://babeljs.io
[rollup]: https://rollupjs.org
