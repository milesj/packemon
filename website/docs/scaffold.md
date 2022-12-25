---
title: scaffold
---

The `scaffold` command is an interactive prompt that scaffolds a project or package from scratch. It
creates all the necessary files, folders, and configurations for maintaining an npm package(s).

The command _requires_ a destination folder param to copy files to. The path is relative to the
current working directory.

```bash
packemon scaffold .
```

## Options

Scaffold supports the following command line options.

- `--force` - Overwrite files that already exist (if running the same command multiple times).
- `--skipInstall` - Skip installation of npm dependencies. Defaults to `false`.
- `--packageManager` - Package manager to install dependencies with. Defaults to `yarn`.
- `--packagesFolder` - Folder in which packages will be located (monorepo only). Defaults to
  `packages`.
- `--template` - Template to select by default.

## Templates

The following templates can be scaffolded.

### `monorepo`

Structures a project to be a monorepo of many packages.

- Creates config files for common developer tools (Babel, ESLint, Jest, TypeScript, etc), based on
  [moonrepo presets](https://github.com/moonrepo/dev).
- Creates a `packages` folder where all packages will exist. Create a package with the
  `monorepo-package` template.
- Configures `package.json` with pre-defined scripts _and_ Yarn workspaces.
- Configures `tsconfig.json` for type-checking _and_ project references.

### `monorepo-package`

Creates an npm package within a monorepo's `packages` folder. Requires `monorepo` to be scaffolded
first!

- Creates `src` and `tests` folders with example TypeScript files.
- Creates a `package.json` with information gathered from the prompts.
- Configures package `tsconfig.json`s to use project references.
- Adds a reference to the root `tsconfig.json`.

### `polyrepo-package`

Structures a project to be a polyrepo. Creates a single npm package within the current folder.

- Creates config files for common developer tools (Babel, ESLint, Jest, TypeScript, etc), based on
  [moonrepo presets](https://github.com/moonrepo/dev).
- Creates `src` and `tests` folders with example TypeScript files.
- Creates a `package.json` with information gathered from the prompts.
- Configures `package.json` with pre-defined scripts.
- Configures `tsconfig.json` for type-checking.
