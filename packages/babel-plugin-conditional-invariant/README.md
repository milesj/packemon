# babel-plugin-conditional-invariant

[![Build Status](https://github.com/milesj/packemon/workflows/Build/badge.svg)](https://github.com/milesj/packemon/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/babel-plugin-conditional-invariant.svg)](https://www.npmjs.com/package/babel-plugin-conditional-invariant)

Wrap invariant function checks in `process.env.NODE_ENV` conditionals that only run in development.

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

## Installation

```
yarn add --dev babel-plugin-conditional-invariant
```

Add the plugin to your root `babel.config.*` file.

```js
module.exports = {
  plugins: ['babel-plugin-conditional-invariant'],
};
```

## Requirements

- Linux, OSX, Windows
- Node 18.12+
