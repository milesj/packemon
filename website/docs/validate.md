---
title: Validating packages
sidebar_label: validate
---

Before a package can be published, there are many requirements that should be checked and validated.
Does the package have a valid entry point? Does it have a license? Is the `package.json` configured
correctly? So on and so forth.

The `validate` command does just that and can be used to validate an array of options as a thorough
pre-publish step. It accomplishes this by inspecting each package's `package.json` and
[build artifacts](./build.md).

```json title="package.json"
{
  "scripts": {
    "release": "yarn run build && yarn run validate && yarn publish",
    "validate": "packemon validate"
  }
}
```

Any errors found within the validation process will cause a non-zero exit code, while warnings only,
or no warnings or errors would cause a zero exit code.

## Options

Validate supports the following command line options.

- `--deps` - Check that `dependencies`, `peerDependencies`, and `devDependencies` are valid by:
  - Requiring peer deps to have version satisfying dev deps.
  - Disallowing peer and prod deps of the same package.
  - Disallowing `file:` and `link:` versions.
- `--engines` - Check that the current `node`, `npm`, and `yarn` runtimes (on your host machine)
  satisfy the configured `engines` constraint.
- `--entries` - Check the `main`, `module`, `browser`, `types`, `typings`, `bin`, and `man` entry
  points are valid by:
  - Requiring either `main` or `exports` to be configured.
  - Verifying the relative path exists on the file system.
- `--license` - Check that `license` is a valid SPDX license and a `LICENSE` (or `LICENSE.md`) file
  exists.
- `--links` - Check that `homepage` and `bugs` links are valid URLs.
- `--people` - Check that `author` and `contributors` contain a name and optional but valid URL.
- `--repo` - Check that `repository` exists and is a valid URL.

By default _all_ options are enabled, so you'd need to negate them with `--no-*` to disable each one
(this is not suggested).

```bash
packemon validate --no-people
```
