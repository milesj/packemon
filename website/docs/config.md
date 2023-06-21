---
title: Package configuration
---

To configure a package, add a `packemon` block to their `package.json`, with any of the following
optional options. We suggest defining a platform at minimum.

```json title="package.json"
{
  "name": "package",
  "packemon": {
    "platform": "node"
  }
}
```

If you would like to support granular combinations of platforms, its formats, and supported
environments, you may pass an array of options to `packemon`. This is an advanced feature, so use
with caution.

```json title="package.json"
{
  "name": "package",
  "packemon": [
    {
      "inputs": { "index": "src/index.ts" },
      "platform": "node"
    },
    {
      "inputs": { "web": "src/web.ts" },
      "platform": "browser",
      "support": "current"
    },
    {
      "inputs": { "node": "src/node.mjs" },
      "format": "mjs",
      "platform": "node",
      "support": "experimental"
    }
  ]
}
```

## Platforms

The platform in which built code will be ran.

- `browser` _(default)_ - Web browsers on desktop and mobile.
- `electron` - Electron applications.
- `native` - Native devices, primarily for React Native.
- `node` - Node.js runtime.

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

## Support

The supported environment and or version for the configured platform(s).

- `legacy` - An unsupported version. Only exists for legacy projects and systems.
- `stable` _(default)_ - The oldest supported version, typically a version in LTS maintenance mode.
- `current` - The current supported LTS version.
- `experimental` - The newest version, typically not yet released for LTS. Is experimental or
  unstable.

```json
{
  "support": "current"
}
```

> We suggest leaving this setting at `stable` for all libraries, as it offers the widest range of
> support for consumers.

### Legend

The supported environments above map to the following platform targets.

|          | Legacy              | Stable              | Current         | Experimental           |
| -------- | ------------------- | ------------------- | --------------- | ---------------------- |
| Browser  | >= 0.10%, not IE 11 | defaults, not IE 11 | >= 1%, not dead | last 2 chrome versions |
| Electron | >= 7.0.0            | >= 11.0.0           | >= 16.0.0       | >= 21.0.0              |
| Native   | >= iOS 13           | >= iOS 14           | >= iOS 15       | >= iOS 16              |
| Node     | >= 14.15.0          | >= 16.12.0          | >= 18.12.0      | >= 19.0.0              |

## Formats

The output format for each platform build target. Each format will create a folder relative to the
project root that will house the built files.

> Packemon defaults to an ECMAScript format if available.

### Browser

- `lib` - [CommonJS](https://nodejs.org/api/modules.html) output using `.js` file extension. For
  standard JavaScript and TypeScript projects.
- `esm` _(default)_ - ECMAScript module output using `.js` file extension. The same as `lib`, but
  uses `import/export` instead of `require`.
- `umd` - Universal Module Definition output using `.js` file extension. Meant to be used directly
  in the browser (via CDN) instead of being bundled. Will be automatically enabled if
  [namespace](#namespace) is provided and using default formats.

### Electron

- `lib` - [CommonJS](https://nodejs.org/api/modules.html) output using `.js` file extension. For
  standard JavaScript and TypeScript projects.
- `esm` _(default)_ - ECMAScript module output using `.js` file extension. The same as `lib`, but
  uses `import/export` instead of `require`.

### Native

- `lib` _(default)_ - [CommonJS](https://nodejs.org/api/modules.html) output using `.js` file
  extension. For standard JavaScript and TypeScript projects. _This is the only format supported by
  React Native and Metro._

### Node

- `lib` - [CommonJS](https://nodejs.org/api/modules.html) output using `.js` file extension. For
  standard JavaScript and TypeScript projects.
- `cjs` - [CommonJS](https://nodejs.org/api/modules.html) output using `.cjs` file extension. Source
  files must be written in CommonJS (`.cjs`) and `require` paths must use trailing extensions. _Will
  automatically create [`.mjs` wrappers](./features.md#automatic-mjs-wrappers-for-cjs-inputs) for
  inputs._
- `mjs` _(default)_ - [ECMAScript module](https://nodejs.org/api/esm.html) output using `.mjs` file
  extension. Source files must be written in ESM (`.mjs`) and `import` paths must use trailing
  extensions.

```json
{
  "format": "lib"
}
```

To support multiple formats, pass an array.

```json
{
  "format": ["lib", "esm"]
}
```

## Inputs

A mapping of entry points for the library (only when [bundling](#bundle)), where the object key is
the name of the output file to be built (without extension), and the value is an input source file
relative to the package root.

```json
{
  "inputs": {
    "index": "src/index.ts",
    "client": "src/client/index.ts",
    "server": "src/server.ts"
  }
}
```

Defaults to `{ "index": "src/index.ts" }` if not defined. If you're _not_ using TypeScript, you will
need to configure this.

> These inputs can be automatically mapped to `package.json` `exports` using the `--addExports` CLI
> option. Do note that this feature is still experimental.

## Features

Feature flags can be enabled on a per-package basis, providing far more granular control, and
providing an opt-in mechanism for experimental features. The following features are available:

- `helpers` (`string`) - How Babel/swc helpers should be handled when transpiling. Accepts `bundled`
  (default), `external`, `runtime`, or `inline`.
- `swc` (`bool`) - Transpile source files with [swc](./swc) instead of Babel. Defaults to `false`.

```json
{
  "features": {
    "helpers": "runtime"
  }
}
```

## Externals

By default, Packemon will denote all `package.json` dependencies (peer, dev, and prod) as Rollup
externals. If you need to define custom externals (path aliases, etc), you can utilize the
`externals` option, which accepts a string or an array of strings.

```json
{
  "externals": "some-module-name"
}
```

Externals can also be provided as regex-strings that will be used with string `match()`.

```json
{
  "externals": ["@scope/\\*"]
}
```

## API

Declares the type of import/export API this package is providing, either `public` or `private`. If
not provided, is `public` for `node` platform, but `private` for all other platforms.

- **Public** - Allows deep imports, where the import path is a 1:1 to a file system path within the
  package. When adding `exports`, will use
  [subpath export patterns](https://nodejs.org/api/packages.html#subpath-patterns) that will
  wildcard match any file in the output format.
- **Private** - Disallows deep imports, and _only_ allows index and [inputs](#inputs) imports. When
  using `exports`, inputs will use
  [subpath exports](https://nodejs.org/api/packages.html#subpath-exports) that are relative from the
  package index.

```json
{
  "api": "public"
}
```

## Bundle

Whether to bundle the source code into a single file for each [input](#inputs). If not provided, is
`false` for `node` platform, but `true` for all other platforms.

```json
{
  "bundle": false
}
```

> Prefer the defaults as much as possible. The only time this setting should change is if the
> package should allow deep imports. For example, a component library.

## Namespace

For browsers only, this would be the name of the UMD global variable.

```json
{
  "namespace": "Packemon"
}
```
