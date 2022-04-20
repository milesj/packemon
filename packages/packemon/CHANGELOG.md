# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 - 2022-04-20

#### 💥 Breaking

- Drop IE support. Update browser targets. (#114) ([6f5c730](https://github.com/milesj/packemon/commit/6f5c730)), closes [#114](https://github.com/milesj/packemon/issues/114)
- Drop Node.js v10/12 support and shift Node.js/npm support versions. (#113) ([38340df](https://github.com/milesj/packemon/commit/38340df)), closes [#113](https://github.com/milesj/packemon/issues/113)
- Only support a single `format`. (#119) ([24fca16](https://github.com/milesj/packemon/commit/24fca16)), closes [#119](https://github.com/milesj/packemon/issues/119)
- Remove `--analyze` option. (#105) ([e85e42c](https://github.com/milesj/packemon/commit/e85e42c)), closes [#105](https://github.com/milesj/packemon/issues/105)
- Remove `.babelrc` support. (#112) ([46a70ac](https://github.com/milesj/packemon/commit/46a70ac)), closes [#112](https://github.com/milesj/packemon/issues/112)
- Remove API extractor. (#104) ([e3270e1](https://github.com/milesj/packemon/commit/e3270e1)), closes [#104](https://github.com/milesj/packemon/issues/104)

#### 🚀 Updates

- Add support for `swc` instead of `babel`. (#107) ([702932a](https://github.com/milesj/packemon/commit/702932a)), closes [#107](https://github.com/milesj/packemon/issues/107)
- Change babel import to CJS. (#118) ([8cfb834](https://github.com/milesj/packemon/commit/8cfb834)), closes [#118](https://github.com/milesj/packemon/issues/118)
- Ensure package `exports` conditions are sorted correctly. (#111) ([51f5aa4](https://github.com/milesj/packemon/commit/51f5aa4)), closes [#111](https://github.com/milesj/packemon/issues/111)
- Update `esm` and `mjs` to be tagged as "Module". (#116) ([e62a64a](https://github.com/milesj/packemon/commit/e62a64a)), closes [#116](https://github.com/milesj/packemon/issues/116)

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([e9f756e](https://github.com/milesj/packemon/commit/e9f756e))
- **[npm-packlist]** Update to v5. ([1ddbf7a](https://github.com/milesj/packemon/commit/1ddbf7a))
- Remove builtin-modules. ([170d9a2](https://github.com/milesj/packemon/commit/170d9a2))
- **[rollup-plugin-node-externals]** Update to v4. ([c49121e](https://github.com/milesj/packemon/commit/c49121e))
- **[rollup-plugin-polyfill-node]** Update to v0.9. ([062a967](https://github.com/milesj/packemon/commit/062a967))
- **[rollup]** Update core and plugins to latest. ([9919064](https://github.com/milesj/packemon/commit/9919064))
- Update Babel and swc usage. ([be7f902](https://github.com/milesj/packemon/commit/be7f902))
- Update minor and patch versions. ([76edf11](https://github.com/milesj/packemon/commit/76edf11))

#### 🛠 Internals

- Dont use workspaces for lerna. ([a34a005](https://github.com/milesj/packemon/commit/a34a005))
- Enable React/JSX tests. ([e4e7e68](https://github.com/milesj/packemon/commit/e4e7e68))
- Test bundling scenarios. (#110) ([5b16274](https://github.com/milesj/packemon/commit/5b16274)), closes [#110](https://github.com/milesj/packemon/issues/110)

**Note:** Version bump only for package packemon





## 1.15.0 - 2022-03-30

#### 🚀 Updates

- Support React automatic JSX transform. (#108) ([e4daf28](https://github.com/milesj/packemon/commit/e4daf28)), closes [#108](https://github.com/milesj/packemon/issues/108)

#### 🐞 Fixes

- Fix --loadConfigs not being populated. ([d38540f](https://github.com/milesj/packemon/commit/d38540f))

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([c87f0a9](https://github.com/milesj/packemon/commit/c87f0a9))

**Note:** Version bump only for package packemon


## 1.14.1 - 2022-03-19

#### 📦 Dependencies

- Update internals. ([3aba5ac](https://github.com/milesj/packemon/commit/3aba5ac))
- **[beemo]** Update to v2 latest. ([d6aeac1](https://github.com/milesj/packemon/commit/d6aeac1))
- **[magic-string]** Update to v0.26. ([dde44a1](https://github.com/milesj/packemon/commit/dde44a1))
- **[npm-packlist]** Update to v4. ([263013e](https://github.com/milesj/packemon/commit/263013e))
- **[rollup-plugin-visualizer]** Update to v5.6. ([0ed1404](https://github.com/milesj/packemon/commit/0ed1404))
- **[rollup]** Update to v2.70. (#103) ([a1af6ef](https://github.com/milesj/packemon/commit/a1af6ef)), closes [#103](https://github.com/milesj/packemon/issues/103)


## 1.14.0 - 2022-02-23

#### 🚀 Updates

- Add a --stamp option. (#101) ([6b11bb4](https://github.com/milesj/packemon/commit/6b11bb4)), closes [#101](https://github.com/milesj/packemon/issues/101)

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([327cd01](https://github.com/milesj/packemon/commit/327cd01))
- **[rollup]** Update to v2.68. ([33db641](https://github.com/milesj/packemon/commit/33db641))

**Note:** Version bump only for package packemon





## 1.13.0 - 2022-02-13

#### 🚀 Updates

- Support Babel/Rollup mutation through a custom Packemon config. (#99) ([c1a8d70](https://github.com/milesj/packemon/commit/c1a8d70)), closes [#99](https://github.com/milesj/packemon/issues/99)

#### 🐞 Fixes

- Check for dot files when gathering file pack list. ([9233d08](https://github.com/milesj/packemon/commit/9233d08))
- Dont show outdated message if quiet. ([007fbad](https://github.com/milesj/packemon/commit/007fbad))
- Temporarily disable peer + dev dependency check. ([33a12ba](https://github.com/milesj/packemon/commit/33a12ba))

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([bb59cda](https://github.com/milesj/packemon/commit/bb59cda))

**Note:** Version bump only for package packemon





## 1.12.0 - 2022-02-03

#### 🚀 Updates

- Add a `--quiet` option. (#98) ([78d1ab3](https://github.com/milesj/packemon/commit/78d1ab3)), closes [#98](https://github.com/milesj/packemon/issues/98)

#### 🐞 Fixes

- Add plus sign to platform environment. ([68d4f71](https://github.com/milesj/packemon/commit/68d4f71))

#### 📦 Dependencies

- **[babel]** Update to v7.17. ([db31640](https://github.com/milesj/packemon/commit/db31640))
- **[boost]** Update to v3 latest. ([78b0e9c](https://github.com/milesj/packemon/commit/78b0e9c))
- **[rollup]** Update to v2.67. ([230237f](https://github.com/milesj/packemon/commit/230237f))

**Note:** Version bump only for package packemon





### 1.11.1 - 2022-01-27

#### 🐞 Fixes

- Dont copy assets that come from node modules. ([8282550](https://github.com/milesj/packemon/commit/8282550))

#### 📦 Dependencies

- **[babel]** Update to v7.16 latest. ([fcad842](https://github.com/milesj/packemon/commit/fcad842))
- **[rollup]** Update to v2.66. ([38fa6ec](https://github.com/milesj/packemon/commit/38fa6ec))

**Note:** Version bump only for package packemon





## 1.11.0 - 2022-01-20

#### 🚀 Updates

- Support asset importing. (#97) ([836190a](https://github.com/milesj/packemon/commit/836190a)), closes [#97](https://github.com/milesj/packemon/issues/97)

#### 🐞 Fixes

- Dont show package outdated in CI. ([d54b3a9](https://github.com/milesj/packemon/commit/d54b3a9))
- Ignore test files when not bundling. ([d723786](https://github.com/milesj/packemon/commit/d723786))

#### 📦 Dependencies

- **[api-extractor]** Update to latest version. ([57c5899](https://github.com/milesj/packemon/commit/57c5899))
- **[babel]** Update to v7.16 latest. ([f8d02e5](https://github.com/milesj/packemon/commit/f8d02e5))
- **[beemo-dev]** Update to latest configs. ([ad4807d](https://github.com/milesj/packemon/commit/ad4807d))
- **[rollup]** Update to v2.64. ([e3b8e44](https://github.com/milesj/packemon/commit/e3b8e44))

**Note:** Version bump only for package packemon





## 1.10.0 - 2021-12-19

#### 🚀 Updates

- Support an `addFiles` option. (#93) ([12e203b](https://github.com/milesj/packemon/commit/12e203b)), closes [#93](https://github.com/milesj/packemon/issues/93)
- Support code-splitting and dynamic imports. (#94) ([6b446fb](https://github.com/milesj/packemon/commit/6b446fb)), closes [#94](https://github.com/milesj/packemon/issues/94)

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([c1bebdd](https://github.com/milesj/packemon/commit/c1bebdd))
- **[boost]** Update to v3 latest. ([2061ef9](https://github.com/milesj/packemon/commit/2061ef9))
- **[rollup]** Update to v2.61. ([b8bf42b](https://github.com/milesj/packemon/commit/b8bf42b))

**Note:** Version bump only for package packemon





## 1.9.0 - 2021-12-07

#### 🚀 Updates

- Add `api` config setting. (#92) ([2686012](https://github.com/milesj/packemon/commit/2686012)), closes [#92](https://github.com/milesj/packemon/issues/92)
- Use subpath patterns for non-bundled exports. (#91) ([545409d](https://github.com/milesj/packemon/commit/545409d)), closes [#91](https://github.com/milesj/packemon/issues/91)

#### 📦 Dependencies

- **[rollup]** Update to v2.60 latest. ([e73d949](https://github.com/milesj/packemon/commit/e73d949))
- Update to latest. ([e398eef](https://github.com/milesj/packemon/commit/e398eef))

**Note:** Version bump only for package packemon





## 1.8.0 - 2021-11-23

#### 🚀 Updates

- Only generate TS declarations when necessary, and per project. ([5c72f8a](https://github.com/milesj/packemon/commit/5c72f8a))

#### 📦 Dependencies

- Update to latest. ([2c95abe](https://github.com/milesj/packemon/commit/2c95abe))

#### 📘 Docs

- Remove broken badges. ([a962e24](https://github.com/milesj/packemon/commit/a962e24))

#### 🛠 Internals

- Undo force changes. ([0c5ec48](https://github.com/milesj/packemon/commit/0c5ec48))
- Use forward slashes for path args. ([5121036](https://github.com/milesj/packemon/commit/5121036))

**Note:** Version bump only for package packemon





### 1.7.2 - 2021-11-18

#### 📦 Dependencies

- **[boost]** Update to v3. (#87) ([5ba2eec](https://github.com/milesj/packemon/commit/5ba2eec)), closes [#87](https://github.com/milesj/packemon/issues/87)

**Note:** Version bump only for package packemon





### 1.7.1 - 2021-11-12

#### 📦 Dependencies

- **[react]** Update to v17. ([de2de45](https://github.com/milesj/packemon/commit/de2de45))
- **[rollup]** Update to v2.60. ([c40937f](https://github.com/milesj/packemon/commit/c40937f))

**Note:** Version bump only for package packemon





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
