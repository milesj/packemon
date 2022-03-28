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
- Granular Babel plugin/preset control.
- Equivalent custom plugins:
  - `babel-plugin-cjs-esm-interop`
  - `babel-plugin-conditional-invariant`
  - `babel-plugin-env-constants`
