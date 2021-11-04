# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.7.0 - 2021-11-04

#### 🚀 Updates

- Add a `files` command. (#89) ([42107bd](https://github.com/milesj/packemon/commit/42107bd)), closes [#89](https://github.com/milesj/packemon/issues/89)

#### 📦 Dependencies

- **[babel]** Update to v7.16 latest. ([26de0eb](https://github.com/milesj/packemon/commit/26de0eb))
- **[rollup]** Update to v2.59. ([6614760](https://github.com/milesj/packemon/commit/6614760))
- Update minor and patch versions. ([65408c3](https://github.com/milesj/packemon/commit/65408c3))

**Note:** Version bump only for package packemon





## 1.6.0 - 2021-10-12

#### 🚀 Updates

- Support format/platform/support for Babel configs. ([7b75b09](https://github.com/milesj/packemon/commit/7b75b09))
- Upgrade Rollup to generate smaller code and utilize ES2015 features. ([e6d492a](https://github.com/milesj/packemon/commit/e6d492a))

#### 🐞 Fixes

- Resolve module lookup failures for yarn dlx. ([140d3e1](https://github.com/milesj/packemon/commit/140d3e1))

#### 📦 Dependencies

- **[ink]** Update to v3.2. ([c676fa5](https://github.com/milesj/packemon/commit/c676fa5))

**Note:** Version bump only for package packemon





## 1.5.0 - 2021-09-11

#### 🚀 Updates

- Add `scaffold` command and associated templates. (#85) ([c9f22af](https://github.com/milesj/packemon/commit/c9f22af)), closes [#85](https://github.com/milesj/packemon/issues/85)

#### 📦 Dependencies

- Update dev dependencies. ([c725613](https://github.com/milesj/packemon/commit/c725613))

#### 📘 Docs

- Add features section. ([59b71cb](https://github.com/milesj/packemon/commit/59b71cb))
- Update Docusaurus API. ([d6b2b28](https://github.com/milesj/packemon/commit/d6b2b28))

**Note:** Version bump only for package packemon





### 1.4.2 - 2021-09-03

#### 📦 Dependencies

- Update dev dependencies. ([1e995f7](https://github.com/milesj/packemon/commit/1e995f7))

#### 📘 Docs

- Lowercase npm name. ([5f38644](https://github.com/milesj/packemon/commit/5f38644))

**Note:** Version bump only for package packemon





### 1.4.1 - 2021-08-28

#### 🐞 Fixes

- Add missing babel-plugin-cjs-esm-interop dep. ([77af564](https://github.com/milesj/packemon/commit/77af564))

**Note:** Version bump only for package packemon





## 1.4.0 - 2021-08-28

#### 🚀 Updates

- Migrate to ESM-first source code. (#83) ([50ee442](https://github.com/milesj/packemon/commit/50ee442)), closes [#83](https://github.com/milesj/packemon/issues/83)

#### 📦 Dependencies

- **[babel]** Update to v7.15. ([2b8d592](https://github.com/milesj/packemon/commit/2b8d592))
- **[beemo-dev]** Update to latest configs. ([db6947e](https://github.com/milesj/packemon/commit/db6947e))
- **[boost]** Update to v2 latest. ([bff29df](https://github.com/milesj/packemon/commit/bff29df))
- **[filesize]** Update to v8. ([b78c4d9](https://github.com/milesj/packemon/commit/b78c4d9))
- **[npm-packlist]** Update to v3. ([384edf2](https://github.com/milesj/packemon/commit/384edf2))
- **[rollup]** Update to v2.56. ([222283c](https://github.com/milesj/packemon/commit/222283c))

#### 🛠 Internals

- Upgrade to TypeScript v4.4. ([ff41b61](https://github.com/milesj/packemon/commit/ff41b61))

**Note:** Version bump only for package packemon





## 1.3.0 - 2021-08-02

#### 🚀 Updates

- Support a new `externals` option. (#80) ([c935e35](https://github.com/milesj/packemon/commit/c935e35)), closes [#80](https://github.com/milesj/packemon/issues/80)

#### 📦 Dependencies

- **[beemo]** Update to v2 latest. ([6534d5b](https://github.com/milesj/packemon/commit/6534d5b))
- **[rollup]** Update to v2.55. ([41e35b6](https://github.com/milesj/packemon/commit/41e35b6))

**Note:** Version bump only for package packemon





## 1.2.0 - 2021-07-17

#### 🚀 Updates

- Add Babel plugin for handling invariant() functions. (#78) ([98485ce](https://github.com/milesj/packemon/commit/98485ce)), closes [#78](https://github.com/milesj/packemon/issues/78)

#### 🐞 Fixes

- Use `peerDependenciesMeta` instead of `optionalPeerDependencies`. ([0d41cd1](https://github.com/milesj/packemon/commit/0d41cd1))

#### 📦 Dependencies

- **[boost]** Update to v2 latest. Improve CLI rendering. ([d9677f8](https://github.com/milesj/packemon/commit/d9677f8))
- **[rollup]** Update to v2 latest. ([81fbe88](https://github.com/milesj/packemon/commit/81fbe88))

#### 🛠 Internals

- Migrate to Yarn 2. (#79) ([bf5522a](https://github.com/milesj/packemon/commit/bf5522a)), closes [#79](https://github.com/milesj/packemon/issues/79)
- Move Babel plugin to its own package. (#77) ([d41deca](https://github.com/milesj/packemon/commit/d41deca)), closes [#77](https://github.com/milesj/packemon/issues/77)
- Setup Lerna for releases. ([49acd0e](https://github.com/milesj/packemon/commit/49acd0e))
- Switch to a monorepo. (#76) ([37f4c1d](https://github.com/milesj/packemon/commit/37f4c1d)), closes [#76](https://github.com/milesj/packemon/issues/76)
- Update versions for release. ([91d53c0](https://github.com/milesj/packemon/commit/91d53c0))

**Note:** Version bump only for package packemon





## 1.1.0 - 2021-07-11

#### 🚀 Updates

- Set Rollup `interop` to auto.

#### 🐞 Fixes

- Fix namespace imports being lost.

#### 📦 Dependencies

- **[rollup]** Update to v2.53.
- **[api-extractor]** Update to latest version.
- Update root and dev dependencies.

# 1.0.0 - 2021-06-14

#### 🎉 Release

- Official release after months of production usage!
