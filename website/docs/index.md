---
title: Introduction
slug: /
---

Are you a library maintainer? Confused on how to build packages for consumers? Unsure of what
tooling and plugins to use? What about CommonJS vs ECMAScript? TypeScript, JavaScript, or FlowType?
Forget that headache and let Packemon do the heavy lifting for you. No need to fiddle with Babel or
Rollup configurations!

Packemon is a "batteries included" CLI that will prepare each package for distribution by building
with the proper tooling and plugins, provide sane defaults and configurations, verify package
requirements, and much more! By default Packemon will generate ECMAScript modules, but can be
configured to support all formats.

[Sound great? Let's get started!](./install.mdx)

## Features

- Scaffold TypeScript packages, in either a monorepo or polyrepo project setup.
- Configure packages for Node.js, Web browsers, or React Native, with multiple output formats like
  CommonJS and ECMAScript (default).
- Build packages with Rollup to create self-contained and tree-shaken bundles. Provide the smallest
  file sizes possible!
- Support a single index import, multiple imports, deep imports, or any kind of entry point.
- Transform packages with Babel's `preset-env` and the configured platform targets. Only ship and
  polyfill what's truly necessary!
- Generate and combine TypeScript declarations into a single public-only API representation.
- Generate compact source maps for platform + format based builds.
- [And many more...](./features.md)

## Requirements

- Linux, OSX, Windows
- Node 14.19+
