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

> In the future, we hope to support other platforms like Electron and React Native.

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

|            | Legacy    | Stable    | Current      | Experimental           |
| ---------- | --------- | --------- | ------------ | ---------------------- |
| Browser    | >= IE 10  | >= IE 11  | > 0.5% usage | last 2 chrome versions |
| Native     | >= iOS 8  | >= iOS 10 | >= iOS 12    | >= iOS 14              |
| Node       | >= 8.10.0 | >= 10.3.0 | >= 12.0.0    | >= 15.0.0              |
| Node (NPM) | >= 5.6.0  | >= 6.1.0  | >= 6.9.0     | >= 7.0.0               |

## Formats

The output format for each platform build target. Each format will create a folder relative to the
project root that will house the built files.

### Browser

- `lib` _(default)_ - [CommonJS](https://nodejs.org/api/modules.html) output using `.js` file
  extension. For standard JavaScript and TypeScript projects.
- `esm` _(default)_ - ECMAScript module output using `.js` file extension. The same as `lib`, but
  uses `import/export` instead of `require`.
- `umd` - Universal Module Definition output using `.js` file extension. Meant to be used directly
  in the browser (via CDN) instead of being bundled. Will be automatically enabled if
  [namespace](#namespace) is provided and using default formats.

### Native

- `lib` _(default)_ - [CommonJS](https://nodejs.org/api/modules.html) output using `.js` file
  extension. For standard JavaScript and TypeScript projects. _This is the only format supported by
  React Native and Metro._

### Node

- `lib` _(default)_ - [CommonJS](https://nodejs.org/api/modules.html) output using `.js` file
  extension. For standard JavaScript and TypeScript projects.
- `cjs` - [CommonJS](https://nodejs.org/api/modules.html) output using `.cjs` file extension. Source
  files must be written in CommonJS (`.cjs`) and `require` paths must use trailing extensions.
- `mjs` - [ECMAScript module](https://nodejs.org/api/esm.html) output using `.mjs` file extension.
  Source files must be written in ESM (`.mjs`) and `import` paths must use trailing extensions.

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

## Inputs

A mapping of entry points for the library, where the object key is the name of the output file to be
built (without extension), and the value is an input source file relative to the package root.

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

## Namespace

For browsers only, this would be the name of the UMD global variable.

```json
{
  "namespace": "Packemon"
}
```
