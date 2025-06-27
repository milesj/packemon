---
title: Introduction
slug: /
---

> ‼️ Packemon is deprecated and will not receive future updates. This library served its purpose
> during the CJS vs ESM wars, but there are better options now a days. I suggest using
> [tsdown](https://tsdown.dev/), which is _very_ similar to Packemon, but is backed by VoidZero, the
> team behind Vite and Rolldown.

Are you a library maintainer? Confused on how to build packages for consumers? Unsure of what
tooling and plugins to use? What about CommonJS vs ECMAScript? TypeScript, JavaScript, or FlowType?
Forget that headache and let Packemon do the heavy lifting for you. No need to fiddle with Babel or
Rollup configurations!

Packemon is a "batteries included" CLI that will prepare each package for distribution by building
with the proper tooling and plugins, provide sane defaults and configurations, verify package
requirements, and much more! By default Packemon will generate ECMAScript modules, but can be
configured to support all formats.

[Sound great? Let's get started!](./install)

## Features

- Scaffold TypeScript packages, in either a monorepo or polyrepo project setup.
- Configure packages for Node.js, Web browsers, React Native, or Electron, with multiple output
  formats like CommonJS and ECMAScript.
- Build packages with Rollup to create self-contained and tree-shaken bundles. Provide the smallest
  file sizes possible!
- Support a single index import, multiple imports, deep imports, or any kind of entry point.
- Transform packages with Babel's `preset-env` and the configured platform targets. Only ship and
  polyfill what's truly necessary!
- Generate and combine TypeScript declarations into a single public-only API representation.
- Generate compact source maps for platform + format based builds.
- [And many more...](./features)

## Requirements

- Linux, OSX, Windows
- Node 18.12+
