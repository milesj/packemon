---
title: Init
sidebar_label: init
---

The `init` command is an interactive prompt that configures each package one-by-one. It asks a
handful of questions, primarily what format(s) the package will build, what platform(s) it will run
on, what environments it will support, entry points, so on and so forth.

Once the prompts are complete, it will inject a `packemon` block to each package's `package.json`.
For more information on settings, check out the [configuration documentation](./config.md).

```bash
packemon init
```

## Options

Init supports the following command line options.

- `--force` - Override packages that have already been configured.
- `--skipPrivate` - Skip `private` packages from being configured.
