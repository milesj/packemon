---
title: init
---

The `init` command is an interactive prompt that configures a package. It asks a series of
questions, primarily what format(s) the package will build, what platform(s) it will run on, what
environments it will support, entry points, so on and so forth.

Once the prompts are complete, it will inject a `packemon` block to the package's `package.json`.
For more information on settings, check out the [configuration documentation](./config).

```bash
packemon init
```

## Options

Init supports the following command line options.

- `--force` - Override if already been configured.
- `--skipPrivate` - Skip `private` packages from being configured.
