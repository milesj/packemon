---
title: pack
---

The `pack` command is a multi-step pre-release solution for preparing a package for distribution.
When ran, it begins by [cleaning](./clean), then [building the package](./build), and finally
[validating the package](./validate) before a release.

If any of the steps fail, a non-zero exit code will be triggered, allowing the release cycle to be
aborted.

```json title="package.json"
{
  "scripts": {
    "pack": "packemon pack --addEngines --declaration",
    "release": "yarn run pack && yarn publish"
  }
}
```

## Options

Pack supports all the same command line options as [`build`](./build). The validation step cannot be
customized and will validate _everything_ by default.
