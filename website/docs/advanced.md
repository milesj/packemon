---
title: Advanced
---

## Creating binary files

A binary is an executable file distributed in an NPM package via the
[bin](https://docs.npmjs.com/files/package.json#bin) field. Packemon offers first class support for
binary files by:

- Prepending a `#!/usr/bin/env node` shebang to the output file. Do not include this in the source
  file!
- Updating the `bin` field in `package.json` to the output file (if not already defined).

To make use of this functionality, you must define an [input](./config.md#inputs) with the name
`bin`, like so.

```json title="package.json"
{
	"name": "package",
	"packemon": {
		"inputs": {
			"bin": "src/bin.ts"
		},
		"platform": "node"
	}
}
```

The contents of the binary source file can be whatever you want, but do be aware that code in the
module scope will be executed immediately when the file is executed by Node.js.

## Referencing sibling inputs

Coming soon...

## Version constraints

If you're using packemon as a global dependency and want to ensure all contributors of your project
are using the correct packemon version, you can provide an `engines` constraint to your root
`package.json`.

```json title="package.json"
{
	"name": "package",
	"engines": {
		"packemon": "^1.0.0"
	}
}
```
