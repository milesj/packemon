---
title: Watch
sidebar_label: watch
---

The `watch` command will monitor the local file system for any changes and trigger a
[rebuild](./build.md) for affected package(s). The watcher will only monitor files within the `src`
folder of each found package, and will rebuild using default build options.

```json title="package.json"
{
  "scripts": {
    "watch": "packemon watch"
  }
}
```

## Options

Watch supports the following command line options.

- `--debounce` - Number of milliseconds to wait after a change before triggering a rebuild. Defaults
  to `150`.
- `--poll` - Poll for file changes instead of using file system events. This is necessary if going
  across the network or through containers.
- `--skipPrivate` - Skip `private` packages from being watched.
