# Packemon

[![Build Status](https://github.com/milesj/packemon/workflows/Build/badge.svg)](https://github.com/milesj/packemon/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/packemon.svg)](https://www.npmjs.com/package/packemon)
[![npm deps](https://david-dm.org/milesj/packemon.svg)](https://www.npmjs.com/package/packemon)

> Gotta pack 'em all!

Are you a library maintainer? Confused on how to build packages for consumers? Unsure of what
tooling and plugins to use? What about CommonJS vs ECMAScript? TypeScript, JavaScript, or FlowType?
Forget that headache and let Packemon do the heavy lifting for you. No need to fiddle with Babel or
Rollup configurations!

Packemon will prepare each package for distribution by building with the proper tooling and plugins,
provide sane defaults and configurations, verify package requirements, and much more!

![Packemon](./docs/cli.png)

## Features

- Configure packages for Node.js or Web browsers, with multiple output formats like CommonJS and
  ECMAScript.
- Builds packages with Rollup to create self-contained and tree-shaken entry points. Provide the
  smallest file sizes possible!
- Transforms packages with Babel's `preset-env` and the configured platform targets. Only ship and
  polyfill what's truly necessary!
- Generate and combine TypeScript declarations into a single public-only API representation.
- Generates compact source maps for browser based builds.

## Requirements

- Linux, OSX, Windows
- Node 10.3+

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
packemon build ./some/other/package
```
