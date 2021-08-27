# babel-plugin-cjs-esm-bridge

[![Build Status](https://github.com/milesj/packemon/workflows/Build/badge.svg)](https://github.com/milesj/packemon/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/babel-plugin-cjs-esm-bridge.svg)](https://www.npmjs.com/package/babel-plugin-cjs-esm-bridge)
[![npm deps](https://david-dm.org/milesj/packemon.svg?path=packages/babel-plugin-cjs-esm-bridge)](https://www.npmjs.com/package/babel-plugin-cjs-esm-bridge)

Transform CommonJS code (`.js`, `.cjs`) into ECMAScript module code (`.mjs`) and vice versa.

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
yarn add --dev babel-plugin-cjs-esm-bridge
```

Add the plugin to your root `babel.config.*` file.

```js
module.exports = {
	plugins: ['babel-plugin-cjs-esm-bridge'],
};
```

## Requirements

- Linux, OSX, Windows
- Node 12.17+
