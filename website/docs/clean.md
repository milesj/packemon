---
title: Clean
sidebar_label: clean
---

Building packages generate temporary files or folders that clutter a project. Sometimes these
artifacts aren't properly cleaned up because a process failed midway. The `clean` command can be
used to remove all temporary files _and_ all build artifacts (lib, esm, etc folders).

```json title="package.json"
{
	"scripts": {
		"clean": "packemon clean"
	}
}
```

> Cleaning a project before a release is a good practice for ensuring unknown artifacts are not
> distributed.
