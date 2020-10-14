# Packemon

[![Build Status](https://github.com/milesj/packemon/workflows/Build/badge.svg)](https://github.com/milesj/packemon/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/packemon.svg)](https://www.npmjs.com/package/packemon)
[![npm deps](https://david-dm.org/milesj/packemon.svg)](https://www.npmjs.com/package/packemon)

> Gotta pack 'em all!

Are you a library maintainer? Confused on how to build packages for consumers? Unsure of what
tooling and plugins to use? What about CommonJS vs ECMAScript? TypeScript, JavaScript, or FlowType?
Forget that headache and let Packemon do the heavy lifting for you!

Packemon will prepare each package for distribution by building with the proper tooling and plugins,
provide sane defaults and configurations, verify package requirements, and much more!

![Packemon](./docs/cli.png)

## Features

- Configure packages for Node.js or Web browsers, with CommonJS and ECMAScript output formats.
- Builds packages with Rollup to create self-contained and tree-shaken entry points. Provide the
  smallest file size possible!
- Transforms packages with Babel's `preset-env` and the configured platform targets. Only ship and
  polyfill what's truly necessary!
- Generate and combine TypeScript declarations into a single public-only API representation.

## Installation

We suggest running Packemon through `npx` instead of installing as a dependency. This will avoid
dependency collisions and lock file churn.

```json
{
  "scripts": {
    "build": "npx packemon build"
  }
}
```

## Setup

Packemon has been designed to build and prepare packages for distribution, and as such, supports
workspaces (monorepos) or single packages (solorepos). By default, only packages configured for
Packemon will be built. This allows specific packages to be completely ignored if need be.

To configure a package, add a `packemon` block to their `package.json`, with any of the following
optional options. We suggest defining a platform at minimum.

```json
{
  "name": "some-package",
  "packemon": {
    "platform": "node"
  }
}
```

### Platforms

The platform in which built code will be ran. In the future, we hope to support other platforms like
Electron and React Native.

- `node` - Node.js runtime.
- `browser` - Web-based browsers on desktop and mobile. _(default)_

```json
{
  "platform": "browser"
}
```

To support multiple platforms, pass an array.

```json
{
  "platform": ["browser", "node"]
}
```

### Support

The supported environment and or version for the configured platform(s).

- `legacy` - An unsupported version. Only exists for legacy projects and systems.
- `stable` - The oldest supported version, typically a version in LTS maintenance mode. _(default)_
- `current` - The current supported LTS version.
- `experimental` - The newest and or experimental version, typically a version not yet released for
  LTS.

```json
{
  "support": "current"
}
```

> We suggest leaving this setting at `stable` for all libraries, as it offers the widest range of
> support for consumers.

### Formats

The output format for each platform build targets.

- Node
  - `lib` - CommonJS output using `.js` file extension. For standard JavaScript and TypeScript
    projects. _(default)_
  - `cjs` - [CommonJS](https://nodejs.org/api/modules.html) output using `.cjs` file extension.
    Source files must be written in CommonJS (`.cjs`) and require paths must use trailing
    extensions.
  - `mjs` - [ECMAScript module](https://nodejs.org/api/esm.html) output using `.mjs` file extension.
    Source files must be written in ESM (`.mjs`) and import paths must use trailing extensions.
- Browser
  - `lib` - CommonJS output using `.js` file extension. For standard JavaScript and TypeScript
    projects. _(default)_
  - `esm` - ECMAScript module output using `.js` file extension. The same as `lib`, but uses
    `import/export` instead of `require`. (default)
  - `umd` - Universal Module Definition output using `.js` file extension. Meant to be used directly
    in the browser (via CDN) instead of being bundled. See [namespace](#namespace) option.

```json
{
  "format": "lib"
}
```

To support multiple formats, or cross-platform formats, pass an array.

```json
{
  "format": ["lib", "cjs", "esm", "umd"]
}
```

### Inputs

A mapping of entry points for the library, where the object key is the name of the output file to be
built, and the value is an input source file relative to the package root.

```json
{
  "inputs" {
    "index": "src/index.ts",
    "client": "src/client/index.ts",
    "server": "src/server.ts"
  }
}
```

Defaults to `{ "index": "src/index.ts" }` if not defined. If you're _not_ using TypeScript, you will
need to configure this.

> These inputs can be automatically be mapped to `package.json` `exports` using the `--addExports`
> CLI option.

### Namespace

For browsers only, this would be the name of the UMD global variable.

```json
{
  "namespace": "Packemon"
}
```

## Commands

### Build

The `build` command will build all packages according to their configured build targets (platform,
formats, etc).

```
packemon build --checkLicenses --generateDeclaration
```

It supports the following command line options.

- `--addEngines` - Add `engine` versions to each `package.json` when `platform` is `node`. Uses the
  `support` setting to determine the version range.
- `--addExports` - Add `exports` fields to each `package.json` according to the `inputs` setting.
  This is an experimental Node.js feature and may not work correctly
  ([more information](https://nodejs.org/api/packages.html#packages_package_entry_points)).
- `--checkLicenses` - Check that packages have a valid `license` field. Will log a warning if
  invalid.
- `--concurrency` - Number of builds to run in parallel. Defaults to OS CPU count.
- `--generateDeclaration` - Generate a single TypeScript declaration for each package according to
  the `inputs` setting. Uses
  [@microsoft/api-extractor](https://www.npmjs.com/package/@microsoft/api-extractor) to generate
  _only_ the public API.
- `--skipPrivate` - Skip `private` packages from being built.
- `--timeout` - Timeout in milliseconds before a build is cancelled. Defaults to no timeout.

By default will find a `package.json` in the current working directory. To build a different
directory, pass a relative path as an argument.

```
packemon build ./some/other/package
```
