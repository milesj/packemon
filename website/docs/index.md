---
title: Introduction
slug: /
---

Are you a library maintainer? Confused on how to build packages for consumers? Unsure of what
tooling and plugins to use? What about CommonJS vs ECMAScript? TypeScript, JavaScript, or FlowType?
Forget that headache and let Packemon do the heavy lifting for you. No need to fiddle with Babel or
Rollup configurations!

Packemon will prepare each package for distribution by building with the proper tooling and plugins,
provide sane defaults and configurations, verify package requirements, and much more!

## Features

- Configure packages for Node.js, Web browsers, or React Native, with multiple output formats like
  CommonJS and ECMAScript.
- Builds packages with Rollup to create self-contained and tree-shaken entry points. Provide the
  smallest file sizes possible!
- Transforms packages with Babel's `preset-env` and the configured platform targets. Only ship and
  polyfill what's truly necessary!
- Generate and combine TypeScript declarations into a single public-only API representation.
- Generates compact source maps for browser based builds.

## Requirements

- Linux, OSX, Windows
- Node 10.3+
