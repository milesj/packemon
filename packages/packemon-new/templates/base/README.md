# <packageName>

Congrats on your new project, powered by Packemon! Here are a few things to know:

- Packemon is meant for packages (not apps) that will be published to npm.
- Packages are pre-configured for Node.js environments. Update each
  [package's config](https://packemon.dev/docs/config) to change this.
- Sources files must be placed in the `src` folder, while tests in the `tests` folder.
- When using a monorepo, packages are located in the `<packagesFolder>` folder.

## Tooling

To improve and automate the developer experience, the following tooling has been automatically
installed and [pre-configured using moonrepo presets](https://github.com/moonrepo/dev).

- [Babel](https://babeljs.io/) for transpiling, configured dynamically with Packemon.
- [ESLint](https://eslint.org/) for linting, configured with
  [eslint-config-moon](https://www.npmjs.com/package/eslint-config-moon).
- [Jest](https://jestjs.io/) for unit testing, configured with
  [jest-preset-moon](https://www.npmjs.com/package/jest-preset-moon).
- [Prettier](https://prettier.io/) for code formatting, configured with
  [prettier-config-moon](https://www.npmjs.com/package/prettier-config-moon).
- [Rollup](https://rollupjs.org) for bundling and distributing, configured dynamically with
  Packemon.
- [TypeScript](https://www.typescriptlang.org/) for type checking, configured with
  [tsconfig-moon](https://www.npmjs.com/package/tsconfig-moon).

Feel free to use the configuration as-is, or to modify, or to not use moon, the choice is yours!

### React support

Scaffolded projects are not configured for React by default, but enabling React support is rather
simple! Open the following files and remove the `// Uncomment if using React/JSX` comment and any
surrounding comments.

- root `.eslintrc.js` (also replace `moon/node` with `moon/browser`)
- root `jest.config.js`
- every `tsconfig.json`
- root `tsconfig.options.json`

Don't forget to install the dependencies also!

```bash
yarn add react react-dom
yarn add --dev @types/react @types/react-dom
```

## Commands

The tooling mentioned above can be ran with the following yarn/npm scripts. For example,
`yarn run build`.

### Build & deploy

- `build` - Build the package(s) with Packemon. Useful for development, as it will only build
  JavaScript targets. Use `pack` for distribution.
- `clean` - Clean all output targets that were built with Packemon.
- `pack` - Clean, build, and validate the package(s) with Packemon. Designed for production and
  should be ran before a release.
- `release` - Pack the package(s), run test checks, and publish to npm! _(Release script not
  configured by Packemon)_
- `validate` - Validate the package(s), ensuring their `package.json` is defined correctly.
- `watch` - Watch for file changes and rebuild the target package. Useful for development.

### Development & testing

- `check` - Run the type checker, linter, and testing suite all at once.
- `format` - Run Prettier and format all files in the project.
- `lint` - Run the linter with ESLint.
- `test`, `coverage` - Run the unit testing suite with Jest, and optionally with code coverage.
- `type` - Run the type checker with TypeScript.

## What's next?

Check out the official documentation to learn more!

- [Configuring packages](https://packemon.dev/docs/config)
- [Features & optimizations](https://packemon.dev/docs/features)
- [Advanced features](https://packemon.dev/docs/advanced)
