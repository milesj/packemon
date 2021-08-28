---
title: ECMAScript first
---

Packemon utilizes the
[`babel-plugin-cjs-esm-interop`](https://npmjs.com/package/babel-plugin-cjs-esm-interop) plugin to
transform ECMAScript module code (ESM) to CommonJS code (CJS) and vice versa. However, it's much
easier to transform from ESM to CJS, as async code (`import()`) can be translated to non-async code
(`require()`) without issue, but the reverse **is not possible**.

Because of this, we suggest _writing all source code in ESM_ (`.mjs`, `.ts`, `.tsx`, `.js` with
module type). _Modules are the future, so start using them today!_

## Requirements

- Use `import` or `import()` instead of `require()`.
- Use `export const` or `export {}` instead of `exports.<name>`.
- Use `export default` instead of `module.exports`.
- Use `import.meta.url` instead of `__filename` and `__dirname`.
- Use `module.createRequire()` or the [`resolve`](https://www.npmjs.com/package/resolve) package
  instead of `require.resolve()`.
- Do not use `require.extensions` or `require.cache`.
- Do not use `process.env.NODE_PATH`.

For a full list of changes,
[view the official Node.js documentation](https://nodejs.org/api/esm.html#esm_interoperability_with_commonjs).
