---
title: Experimental swc support
---

Packemon has experimental support for [swc](https://swc.rs/), a Rust based compiler, and a drop-in
replacement for Babel. If you want improved performance for less features, we suggest swc.

## Enabling swc

There are 3 ways to enable swc:

Define the `PACKEMON_SWC` environment variable.

```shell
PACKEMON_SWC=true packemon build
```

Enable for all packages through a root `packemon.config.{js,ts}` (requires
[`--loadConfigs`](./advanced#customizing-babel-swc-and-rollup)).

```js title="packemon.config.js"
module.exports = {
	swc: true,
};
```

Enable for individual packages through a `.packemon.{js,ts}` in each package. (requires
[`--loadConfigs`](./advanced#customizing-babel-swc-and-rollup)).

```js title="packages/<name>/.packemon.js"
module.exports = {
	swc: true,
};
```

## Unsupported features

Compared to the Babel implementation, our swc implementation does not support the following
features.

- [Flow](https://flow.org/) syntax parsing and transforming.
- UMD [namespace](./config#namespace) (swc uses the filename as the namespace).
- Bundled helpers like Babel (swc inlines them in each file).
- Granular plugin control like Babel.
- Equivalent custom plugins:
  - `babel-plugin-cjs-esm-interop`
  - `babel-plugin-conditional-invariant`

## Differences between Babel

- Env constants (`__DEV__`, `__PROD__`, and `__TEST__`) use
  [`jsc.transform.optimizer.globals`](https://swc.rs/docs/configuration/compilation#jsctransformoptimizerglobals)
  to substitute conditionals. Since we can't use a real plugin, the scenarios in which these
  constants are replaced may differ between the Babel version.
- Legacy targets do not support `async`/`await` by default, and will require the
  [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime) to be installed.
