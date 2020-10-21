# Packemon

[![Build Status](https://github.com/milesj/packemon/workflows/Build/badge.svg)](https://github.com/milesj/packemon/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/packemon.svg)](https://www.npmjs.com/package/packemon)
[![npm deps](https://david-dm.org/milesj/packemon.svg)](https://www.npmjs.com/package/packemon)

> Gotta pack 'em all!

Are you a library maintainer? Confused on how to build packages for consumers? Unsure of what
tooling and plugins to use? What about CommonJS vs ECMAScript? TypeScript, JavaScript, or FlowType?
Forget that headache and let Packemon do the heavy lifting for you. No need to fiddle with Babel or
Rollup configurations!

Packemon will prepare each package for distribution by building with the proper tooling and plugins,
provide sane defaults and configurations, verify package requirements, and much more!

![Packemon](https://raw.githubusercontent.com/milesj/packemon/master/website/static/img/cli.png)

## Features

- Configure packages for Node.js or Web browsers, with multiple output formats like CommonJS and
  ECMAScript.
- Builds packages with Rollup to create self-contained and tree-shaken entry points. Provide the
  smallest file sizes possible!
- Transforms packages with Babel's `preset-env` and the configured platform targets. Only ship and
  polyfill what's truly necessary!
- Generate and combine TypeScript declarations into a single public-only API representation.
- Generates compact source maps for browser based builds.

## Requirements

- Linux, OSX, Windows
- Node 10.3+

## Documentation

[https://packemon.dev](https://packemon.dev)
