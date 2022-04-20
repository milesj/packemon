---
title: Files
sidebar_label: files
---

The `files` command will list all files within a package that will be distributed, based on the
`files` property in `package.json` (if declared), and taking into account any ignore files. This is
useful for verifying the contents of a package is what you expect before publishing.

```bash
packemon files <package name>
```

## Options

Files supports the following command line options.

- `--format` - The format to display the files in. Accepts "tree" (default) or "list".

## Examples

Example output using our own package.

### Tree format

```
┌─ dts
│ └─ index.d.ts
├─ lib
│ ├─ index.js
│ └─ index.js.map
├─ src
│ └─ index.ts
├─ LICENSE
├─ package.json
└─ README.md
```

### List format

```
┌─ dts/index.d.ts
├─ lib/index.js
├─ lib/index.js.map
├─ src/index.ts
├─ LICENSE
├─ package.json
└─ README.md
```