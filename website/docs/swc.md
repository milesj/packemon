---
title: swc integration
---

Packemon has experimental support for [swc](https://swc.rs/), a Rust based compiler and a drop-in
replacement for Babel.

## Unsupported features

Compared to the Babel implementation, our swc implementation does not support the following
features.

- [Flow](https://flow.org/) syntax parsing and transforming.
- UMD [namespace](./config#namespace) (swc uses the filename as the namespace).
- Bundled helpers like Babel (inlines them in each file).
- Granular plugin control like Babel.
- Equivalent custom plugins:
  - `babel-plugin-cjs-esm-interop`
  - `babel-plugin-conditional-invariant`

## Differences

There's also some differences between the two implemenations:

- Env constants (`__DEV__`, `__PROD__`, and `__TEST__`) use
  [`jsc.transform.optimizer.globals`](https://swc.rs/docs/configuration/compilation#jsctransformoptimizerglobals)
  to substitute conditionals. Since we can't use a real plugin, the scenarios in which these
  constants are replaced may differ between the Babel version.
