# babel-plugin-env-constants

[![Build Status](https://github.com/milesj/packemon/workflows/Build/badge.svg)](https://github.com/milesj/packemon/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/babel-plugin-env-constants.svg)](https://www.npmjs.com/package/babel-plugin-env-constants)

Transform `__DEV__`, `__PROD__`, and `__TEST__` constants to `process.env.NODE_ENV` conditionals.

```ts
// Input
if (__DEV__) {
	console.log('Some message in development!');
}

const value = __TEST__ ? 0 : 100;
```

```ts
// Output
if (process.env.NODE_ENV !== 'production') {
	console.log('Some message in development!');
}

const value = process.env.NODE_ENV === 'test' ? 0 : 100;
```

## Installation

```
yarn add --dev babel-plugin-env-constants
```

Add the plugin to your root `babel.config.*` file.

```js
module.exports = {
	plugins: ['babel-plugin-env-constants'],
};
```

And if you are using TypeScript, you'll most likely need to declare the globals yourself.

```ts
declare global {
	const __DEV__: boolean;
	const __PROD__: boolean;
	const __TEST__: boolean;
}
```

## Requirements

- Linux, OSX, Windows
- Node 14.15+
