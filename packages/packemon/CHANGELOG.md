# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### 3.0.2 - 2023-03-06

#### 🐞 Fixes

- Fix sub-path types exports being wrong. ([e151564](https://github.com/milesj/packemon/commit/e151564))

#### 📦 Dependencies

- **[babel]** Update to v7.21 latest. ([597304c](https://github.com/milesj/packemon/commit/597304c))
- **[magic-string]** Update to v0.30. ([21ca2dd](https://github.com/milesj/packemon/commit/21ca2dd))
- **[rollup]** Update to v3.18. ([79cfb9d](https://github.com/milesj/packemon/commit/79cfb9d))
- **[swc]** Update to v1.3.37. ([874a394](https://github.com/milesj/packemon/commit/874a394))

**Note:** Version bump only for package packemon





### 3.0.1 - 2023-02-05

#### 🐞 Fixes

- Dont validate packages if theres no packemon block. (#178) ([e355314](https://github.com/milesj/packemon/commit/e355314)), closes [#178](https://github.com/milesj/packemon/issues/178)

**Note:** Version bump only for package packemon





### 3.0.0 - 2023-01-31

#### 📦 Dependencies

- **[fs-extra]** Update to v11. ([41c627f](https://github.com/milesj/packemon/commit/41c627f))
- **[rollup-plugin-node-externals]** Update to v5.1. ([10b6dc8](https://github.com/milesj/packemon/commit/10b6dc8))
- **[rollup-plugin-polyfill-node]** Update to v0.12. ([0fc6c06](https://github.com/milesj/packemon/commit/0fc6c06))
- **[rollup]** Update to v3.12. ([da5117c](https://github.com/milesj/packemon/commit/da5117c))
- **[swc]** Update to v1.3.31. ([4125717](https://github.com/milesj/packemon/commit/4125717))

#### 🛠 Internals

- Random updates. ([6db2c12](https://github.com/milesj/packemon/commit/6db2c12))

**Note:** Version bump only for package packemon





# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### 3.0.0-alpha.4 - 2023-01-09

#### 🐞 Fixes

- Fix format validation issues. ([89a5a2f](https://github.com/milesj/packemon/commit/89a5a2f))

**Note:** Version bump only for package packemon

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### 3.0.0-alpha.3 - 2023-01-08

#### 🐞 Fixes

- Allow multiple formats to be passed.
  ([5ade653](https://github.com/milesj/packemon/commit/5ade653))

#### 📦 Dependencies

- **[moon]** Update to v0.21.4. ([3d76410](https://github.com/milesj/packemon/commit/3d76410))
- **[rollup]** Update to v3.9. ([108be07](https://github.com/milesj/packemon/commit/108be07))
- **[swc]** Update to v1.3.24. ([f230944](https://github.com/milesj/packemon/commit/f230944))

**Note:** Version bump only for package packemon

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### 3.0.0-alpha.2 - 2023-01-06

#### 🐞 Fixes

- Don't set `lib` format when using `esm`. (#172)
  ([0534522](https://github.com/milesj/packemon/commit/0534522)), closes
  [#172](https://github.com/milesj/packemon/issues/172)

**Note:** Version bump only for package packemon

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0-alpha.1 - 2022-12-25

#### 💥 Breaking

- Remove `--files` support from validation. (#159)
  ([8ff9dd6](https://github.com/milesj/packemon/commit/8ff9dd6)), closes
  [#159](https://github.com/milesj/packemon/issues/159)
- Remove sourcemaps for Node.js. (#163)
  ([4fe3189](https://github.com/milesj/packemon/commit/4fe3189)), closes
  [#163](https://github.com/milesj/packemon/issues/163)
- Remove workspaces support. (#150) ([c22e5f6](https://github.com/milesj/packemon/commit/c22e5f6)),
  closes [#150](https://github.com/milesj/packemon/issues/150)
- Require Node.js v16. Drop old versions. (#155)
  ([9b7b5d5](https://github.com/milesj/packemon/commit/9b7b5d5)), closes
  [#155](https://github.com/milesj/packemon/issues/155)

#### 🚀 Updates

- Add Electron support. (#158) ([70bf699](https://github.com/milesj/packemon/commit/70bf699)),
  closes [#158](https://github.com/milesj/packemon/issues/158)
- Add global `--debug` flag. (#169) ([0601e7b](https://github.com/milesj/packemon/commit/0601e7b)),
  closes [#169](https://github.com/milesj/packemon/issues/169)
- Support `solid` exports automatically. (#162)
  ([1407fb1](https://github.com/milesj/packemon/commit/1407fb1)), closes
  [#162](https://github.com/milesj/packemon/issues/162)
- Update options for Babel plugins/presets. (#160)
  ([1eee0db](https://github.com/milesj/packemon/commit/1eee0db)), closes
  [#160](https://github.com/milesj/packemon/issues/160)

#### 📦 Dependencies

- **[babel]** Update to v7.19.3. ([d2376d5](https://github.com/milesj/packemon/commit/d2376d5))
- **[filesize]** Update to v10. ([a5547f6](https://github.com/milesj/packemon/commit/a5547f6))
- **[rollup]** Update to v3. (#157) ([19b5759](https://github.com/milesj/packemon/commit/19b5759)),
  closes [#157](https://github.com/milesj/packemon/issues/157)
- **[swc]** Update to v1.3.11. ([202bd23](https://github.com/milesj/packemon/commit/202bd23))
- Update dev dependencies. ([d3c2fd7](https://github.com/milesj/packemon/commit/d3c2fd7))

#### 🛠 Internals

- Clean up scaffold templates. (#171)
  ([ed31433](https://github.com/milesj/packemon/commit/ed31433)), closes
  [#171](https://github.com/milesj/packemon/issues/171)
- Improve `--addEngines` and `--addFiles`. (#152)
  ([6e71ca3](https://github.com/milesj/packemon/commit/6e71ca3)), closes
  [#152](https://github.com/milesj/packemon/issues/152)
- Improve entry points and exports. (#154)
  ([62dbbc4](https://github.com/milesj/packemon/commit/62dbbc4)), closes
  [#154](https://github.com/milesj/packemon/issues/154)
- Improve release script. ([5f0fad3](https://github.com/milesj/packemon/commit/5f0fad3))
- Integrate moon. (#168) ([710912f](https://github.com/milesj/packemon/commit/710912f)), closes
  [#168](https://github.com/milesj/packemon/issues/168)
- Rework TypeScript integration. (#151)
  ([9667a16](https://github.com/milesj/packemon/commit/9667a16)), closes
  [#151](https://github.com/milesj/packemon/issues/151)

**Note:** Version bump only for package packemon

### 2.4.1 - 2022-09-08

#### 🐞 Fixes

- Use non-index inputs for entry points. (#149)
  ([8cecfba](https://github.com/milesj/packemon/commit/8cecfba)), closes
  [#149](https://github.com/milesj/packemon/issues/149)

#### 📦 Dependencies

- **[babel]** Update to v7.19. ([19aabea](https://github.com/milesj/packemon/commit/19aabea))
- **[moon-dev]** Update to latest. ([d71b3fa](https://github.com/milesj/packemon/commit/d71b3fa))
- **[rollup]** Update to v2.79. ([0d05ff3](https://github.com/milesj/packemon/commit/0d05ff3))
- **[swc]** Update to v1.2.248. ([2be6863](https://github.com/milesj/packemon/commit/2be6863))

#### 🛠 Internals

- Update snapshots. ([cbb1022](https://github.com/milesj/packemon/commit/cbb1022))

**Note:** Version bump only for package packemon

## 2.4.0 - 2022-08-29

#### 🚀 Updates

- Add Solid.js support (Babel only). (#146)
  ([494d6d3](https://github.com/milesj/packemon/commit/494d6d3)), closes
  [#146](https://github.com/milesj/packemon/issues/146)

#### 🐞 Fixes

- Fix TS declared fields when used with decorators.
  ([36ffb38](https://github.com/milesj/packemon/commit/36ffb38))

**Note:** Version bump only for package packemon

### 2.3.7 - 2022-08-23

#### 🐞 Fixes

- Fixed missing declaration config when compiling for project refs.
  ([606cb39](https://github.com/milesj/packemon/commit/606cb39))

**Note:** Version bump only for package packemon

### 2.3.6 - 2022-08-23

#### 🐞 Fixes

- Fixed an issue where all packages were being built when attempting to build a single package.
  ([e1642bb](https://github.com/milesj/packemon/commit/e1642bb))

**Note:** Version bump only for package packemon

### 2.3.5 - 2022-08-23

#### 🐞 Fixes

- Fix tsc running in the wrong dir. ([700fbb4](https://github.com/milesj/packemon/commit/700fbb4))

**Note:** Version bump only for package packemon

### 2.3.4 - 2022-08-20

#### 🐞 Fixes

- Improve workspace root detection. Fix config loading and validation. (#143)
  ([c01154d](https://github.com/milesj/packemon/commit/c01154d)), closes
  [#143](https://github.com/milesj/packemon/issues/143)
- Update `tsc` to build project references based on the state of the local config. (#142)
  ([c11a6dd](https://github.com/milesj/packemon/commit/c11a6dd)), closes
  [#142](https://github.com/milesj/packemon/issues/142)

#### 📦 Dependencies

- **[boost]** Update to v4. ([12ba06c](https://github.com/milesj/packemon/commit/12ba06c))
- **[rollup]** Update to v2.78. ([7fa90c1](https://github.com/milesj/packemon/commit/7fa90c1))
- **[swc]** Update to v1.2.241. ([467e70b](https://github.com/milesj/packemon/commit/467e70b))

#### 🛠 Internals

- Migrate from beemo to moon. (#141) ([3538adc](https://github.com/milesj/packemon/commit/3538adc)),
  closes [#141](https://github.com/milesj/packemon/issues/141)

**Note:** Version bump only for package packemon

### 2.3.3 - 2022-08-04

#### 🐞 Fixes

- Add "default" export conditions for `browser` and `node` platforms when applicable. (#140)
  ([ab96384](https://github.com/milesj/packemon/commit/ab96384)), closes
  [#140](https://github.com/milesj/packemon/issues/140)
- Ensure dynamic imports are preserved for the target platform. (#139)
  ([b06e89d](https://github.com/milesj/packemon/commit/b06e89d)), closes
  [#139](https://github.com/milesj/packemon/issues/139)

**Note:** Version bump only for package packemon

### 2.3.2 - 2022-07-27

#### 🐞 Fixes

- Don't set missing entry points to an empty string.
  ([6589465](https://github.com/milesj/packemon/commit/6589465))
- Properly handle package exports for dual formats. (#136)
  ([c3687f1](https://github.com/milesj/packemon/commit/c3687f1)), closes
  [#136](https://github.com/milesj/packemon/issues/136)

#### 📦 Dependencies

- **[beemo-dev]** Update to v2 latest.
  ([97dca2a](https://github.com/milesj/packemon/commit/97dca2a))
- **[npm-packlist]** Update to v5.1.1.
  ([f793a62](https://github.com/milesj/packemon/commit/f793a62))
- **[rollup]** Update to v2.77. (#134)
  ([517562b](https://github.com/milesj/packemon/commit/517562b)), closes
  [#134](https://github.com/milesj/packemon/issues/134)
- **[spdx-license-list]** Update to v6.6.
  ([2bf97e0](https://github.com/milesj/packemon/commit/2bf97e0))
- Update internals. ([969a6d5](https://github.com/milesj/packemon/commit/969a6d5))

#### 🛠 Internals

- Remove acorn dep. ([3a2c8d6](https://github.com/milesj/packemon/commit/3a2c8d6))

**Note:** Version bump only for package packemon

### 2.3.1 - 2022-05-30

#### 🐞 Fixes

- Fix exports types when bundling. ([219f35e](https://github.com/milesj/packemon/commit/219f35e))
- Update non-bundle to include more source file types.
  ([01a04cb](https://github.com/milesj/packemon/commit/01a04cb))

**Note:** Version bump only for package packemon

## 2.3.0 - 2022-05-30

#### 🚀 Updates

- Support `.cts` and `.mts` files. (#130)
  ([f0a9041](https://github.com/milesj/packemon/commit/f0a9041)), closes
  [#130](https://github.com/milesj/packemon/issues/130)

#### 🐞 Fixes

- Show a progress indicator when templates are being scaffolded.
  ([a3fd4c4](https://github.com/milesj/packemon/commit/a3fd4c4))

#### 📦 Dependencies

- **[babel]** Update to v7.18 latest. ([7931a45](https://github.com/milesj/packemon/commit/7931a45))
- **[filesize]** Update to v9. ([4b9a31e](https://github.com/milesj/packemon/commit/4b9a31e))
- **[npm-packlist]** Update to v5.1. ([5134d2d](https://github.com/milesj/packemon/commit/5134d2d))
- **[rollup]** Update to v2.75. ([731c825](https://github.com/milesj/packemon/commit/731c825))
- **[swc]** Update to v1.2.194. ([53a1a84](https://github.com/milesj/packemon/commit/53a1a84))

**Note:** Version bump only for package packemon

### 2.2.2 - 2022-05-20

#### 🐞 Fixes

- Improve handling of `default` for package exports. (#127)
  ([08f5995](https://github.com/milesj/packemon/commit/08f5995)), closes
  [#127](https://github.com/milesj/packemon/issues/127)
- Only set `type` when there's 1 build. (#128)
  ([fc250ac](https://github.com/milesj/packemon/commit/fc250ac)), closes
  [#128](https://github.com/milesj/packemon/issues/128)

#### 📦 Dependencies

- **[babel]** Update to v7.17 latest. ([7a1d226](https://github.com/milesj/packemon/commit/7a1d226))
- **[babel]** Update to v7.18 latest. ([be2da27](https://github.com/milesj/packemon/commit/be2da27))
- **[rollup]** Update to v2.74. (#129)
  ([5e0e133](https://github.com/milesj/packemon/commit/5e0e133)), closes
  [#129](https://github.com/milesj/packemon/issues/129)
- **[swc]** Update to v1.2.181. ([7dac168](https://github.com/milesj/packemon/commit/7dac168))

#### 🛠 Internals

- Test scaffolding. (#125) ([04ee133](https://github.com/milesj/packemon/commit/04ee133)), closes
  [#125](https://github.com/milesj/packemon/issues/125)

**Note:** Version bump only for package packemon

### 2.2.1 - 2022-04-29

#### 🐞 Fixes

- Dont sort non-Packemon exports. ([c82c232](https://github.com/milesj/packemon/commit/c82c232))
- Improve React automatic JSX detection for peer deps.
  ([d8b8202](https://github.com/milesj/packemon/commit/d8b8202))

**Note:** Version bump only for package packemon

## 2.2.0 - 2022-04-26

#### 🚀 Updates

- Support dashes in input names. ([aa76abe](https://github.com/milesj/packemon/commit/aa76abe))

#### 🐞 Fixes

- Fix multiple named exports from different sources.
  ([9aa99a2](https://github.com/milesj/packemon/commit/9aa99a2))
- Improve exports sorting by path. (#123)
  ([0d204f3](https://github.com/milesj/packemon/commit/0d204f3)), closes
  [#123](https://github.com/milesj/packemon/issues/123)

**Note:** Version bump only for package packemon

## 2.1.0 - 2022-04-23

#### 🚀 Updates

- Add automatic `.mjs` wrappers for `.cjs` inputs. (#120)
  ([c27dcff](https://github.com/milesj/packemon/commit/c27dcff)), closes
  [#120](https://github.com/milesj/packemon/issues/120)
- Convert Packemon to a `.cjs` library. (#121)
  ([3605e12](https://github.com/milesj/packemon/commit/3605e12)), closes
  [#121](https://github.com/milesj/packemon/issues/121)

#### 📦 Dependencies

- **[npm-packlist]** Update to v5.0.2.
  ([75ea267](https://github.com/milesj/packemon/commit/75ea267))
- **[swc]** Update to v1.2.171. ([d8f0a23](https://github.com/milesj/packemon/commit/d8f0a23))

**Note:** Version bump only for package packemon

# 2.0.0 - 2022-04-20

#### 💥 Breaking

- Drop IE support. Update browser targets. (#114)
  ([6f5c730](https://github.com/milesj/packemon/commit/6f5c730)), closes
  [#114](https://github.com/milesj/packemon/issues/114)
- Drop Node.js v10/12 support and shift Node.js/npm support versions. (#113)
  ([38340df](https://github.com/milesj/packemon/commit/38340df)), closes
  [#113](https://github.com/milesj/packemon/issues/113)
- Only support a single `format`. (#119)
  ([24fca16](https://github.com/milesj/packemon/commit/24fca16)), closes
  [#119](https://github.com/milesj/packemon/issues/119)
- Remove `--analyze` option. (#105) ([e85e42c](https://github.com/milesj/packemon/commit/e85e42c)),
  closes [#105](https://github.com/milesj/packemon/issues/105)
- Remove `.babelrc` support. (#112) ([46a70ac](https://github.com/milesj/packemon/commit/46a70ac)),
  closes [#112](https://github.com/milesj/packemon/issues/112)
- Remove API extractor. (#104) ([e3270e1](https://github.com/milesj/packemon/commit/e3270e1)),
  closes [#104](https://github.com/milesj/packemon/issues/104)

#### 🚀 Updates

- Add support for `swc` instead of `babel`. (#107)
  ([702932a](https://github.com/milesj/packemon/commit/702932a)), closes
  [#107](https://github.com/milesj/packemon/issues/107)
- Change babel import to CJS. (#118) ([8cfb834](https://github.com/milesj/packemon/commit/8cfb834)),
  closes [#118](https://github.com/milesj/packemon/issues/118)
- Ensure package `exports` conditions are sorted correctly. (#111)
  ([51f5aa4](https://github.com/milesj/packemon/commit/51f5aa4)), closes
  [#111](https://github.com/milesj/packemon/issues/111)
- Update `esm` and `mjs` to be tagged as "Module". (#116)
  ([e62a64a](https://github.com/milesj/packemon/commit/e62a64a)), closes
  [#116](https://github.com/milesj/packemon/issues/116)

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs.
  ([e9f756e](https://github.com/milesj/packemon/commit/e9f756e))
- **[npm-packlist]** Update to v5. ([1ddbf7a](https://github.com/milesj/packemon/commit/1ddbf7a))
- Remove builtin-modules. ([170d9a2](https://github.com/milesj/packemon/commit/170d9a2))
- **[rollup-plugin-node-externals]** Update to v4.
  ([c49121e](https://github.com/milesj/packemon/commit/c49121e))
- **[rollup-plugin-polyfill-node]** Update to v0.9.
  ([062a967](https://github.com/milesj/packemon/commit/062a967))
- **[rollup]** Update core and plugins to latest.
  ([9919064](https://github.com/milesj/packemon/commit/9919064))
- Update Babel and swc usage. ([be7f902](https://github.com/milesj/packemon/commit/be7f902))
- Update minor and patch versions. ([76edf11](https://github.com/milesj/packemon/commit/76edf11))

#### 🛠 Internals

- Dont use workspaces for lerna. ([a34a005](https://github.com/milesj/packemon/commit/a34a005))
- Enable React/JSX tests. ([e4e7e68](https://github.com/milesj/packemon/commit/e4e7e68))
- Test bundling scenarios. (#110) ([5b16274](https://github.com/milesj/packemon/commit/5b16274)),
  closes [#110](https://github.com/milesj/packemon/issues/110)

**Note:** Version bump only for package packemon

## 1.15.0 - 2022-03-30

#### 🚀 Updates

- Support React automatic JSX transform. (#108)
  ([e4daf28](https://github.com/milesj/packemon/commit/e4daf28)), closes
  [#108](https://github.com/milesj/packemon/issues/108)

#### 🐞 Fixes

- Fix --loadConfigs not being populated.
  ([d38540f](https://github.com/milesj/packemon/commit/d38540f))

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs.
  ([c87f0a9](https://github.com/milesj/packemon/commit/c87f0a9))

**Note:** Version bump only for package packemon

## 1.14.1 - 2022-03-19

#### 📦 Dependencies

- Update internals. ([3aba5ac](https://github.com/milesj/packemon/commit/3aba5ac))
- **[beemo]** Update to v2 latest. ([d6aeac1](https://github.com/milesj/packemon/commit/d6aeac1))
- **[magic-string]** Update to v0.26. ([dde44a1](https://github.com/milesj/packemon/commit/dde44a1))
- **[npm-packlist]** Update to v4. ([263013e](https://github.com/milesj/packemon/commit/263013e))
- **[rollup-plugin-visualizer]** Update to v5.6.
  ([0ed1404](https://github.com/milesj/packemon/commit/0ed1404))
- **[rollup]** Update to v2.70. (#103)
  ([a1af6ef](https://github.com/milesj/packemon/commit/a1af6ef)), closes
  [#103](https://github.com/milesj/packemon/issues/103)

## 1.14.0 - 2022-02-23

#### 🚀 Updates

- Add a --stamp option. (#101) ([6b11bb4](https://github.com/milesj/packemon/commit/6b11bb4)),
  closes [#101](https://github.com/milesj/packemon/issues/101)

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs.
  ([327cd01](https://github.com/milesj/packemon/commit/327cd01))
- **[rollup]** Update to v2.68. ([33db641](https://github.com/milesj/packemon/commit/33db641))

**Note:** Version bump only for package packemon

## 1.13.0 - 2022-02-13

#### 🚀 Updates

- Support Babel/Rollup mutation through a custom Packemon config. (#99)
  ([c1a8d70](https://github.com/milesj/packemon/commit/c1a8d70)), closes
  [#99](https://github.com/milesj/packemon/issues/99)

#### 🐞 Fixes

- Check for dot files when gathering file pack list.
  ([9233d08](https://github.com/milesj/packemon/commit/9233d08))
- Dont show outdated message if quiet.
  ([007fbad](https://github.com/milesj/packemon/commit/007fbad))
- Temporarily disable peer + dev dependency check.
  ([33a12ba](https://github.com/milesj/packemon/commit/33a12ba))

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs.
  ([bb59cda](https://github.com/milesj/packemon/commit/bb59cda))

**Note:** Version bump only for package packemon

## 1.12.0 - 2022-02-03

#### 🚀 Updates

- Add a `--quiet` option. (#98) ([78d1ab3](https://github.com/milesj/packemon/commit/78d1ab3)),
  closes [#98](https://github.com/milesj/packemon/issues/98)

#### 🐞 Fixes

- Add plus sign to platform environment.
  ([68d4f71](https://github.com/milesj/packemon/commit/68d4f71))

#### 📦 Dependencies

- **[babel]** Update to v7.17. ([db31640](https://github.com/milesj/packemon/commit/db31640))
- **[boost]** Update to v3 latest. ([78b0e9c](https://github.com/milesj/packemon/commit/78b0e9c))
- **[rollup]** Update to v2.67. ([230237f](https://github.com/milesj/packemon/commit/230237f))

**Note:** Version bump only for package packemon

### 1.11.1 - 2022-01-27

#### 🐞 Fixes

- Dont copy assets that come from node modules.
  ([8282550](https://github.com/milesj/packemon/commit/8282550))

#### 📦 Dependencies

- **[babel]** Update to v7.16 latest. ([fcad842](https://github.com/milesj/packemon/commit/fcad842))
- **[rollup]** Update to v2.66. ([38fa6ec](https://github.com/milesj/packemon/commit/38fa6ec))

**Note:** Version bump only for package packemon

## 1.11.0 - 2022-01-20

#### 🚀 Updates

- Support asset importing. (#97) ([836190a](https://github.com/milesj/packemon/commit/836190a)),
  closes [#97](https://github.com/milesj/packemon/issues/97)

#### 🐞 Fixes

- Dont show package outdated in CI. ([d54b3a9](https://github.com/milesj/packemon/commit/d54b3a9))
- Ignore test files when not bundling.
  ([d723786](https://github.com/milesj/packemon/commit/d723786))

#### 📦 Dependencies

- **[api-extractor]** Update to latest version.
  ([57c5899](https://github.com/milesj/packemon/commit/57c5899))
- **[babel]** Update to v7.16 latest. ([f8d02e5](https://github.com/milesj/packemon/commit/f8d02e5))
- **[beemo-dev]** Update to latest configs.
  ([ad4807d](https://github.com/milesj/packemon/commit/ad4807d))
- **[rollup]** Update to v2.64. ([e3b8e44](https://github.com/milesj/packemon/commit/e3b8e44))

**Note:** Version bump only for package packemon

## 1.10.0 - 2021-12-19

#### 🚀 Updates

- Support an `addFiles` option. (#93)
  ([12e203b](https://github.com/milesj/packemon/commit/12e203b)), closes
  [#93](https://github.com/milesj/packemon/issues/93)
- Support code-splitting and dynamic imports. (#94)
  ([6b446fb](https://github.com/milesj/packemon/commit/6b446fb)), closes
  [#94](https://github.com/milesj/packemon/issues/94)

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs.
  ([c1bebdd](https://github.com/milesj/packemon/commit/c1bebdd))
- **[boost]** Update to v3 latest. ([2061ef9](https://github.com/milesj/packemon/commit/2061ef9))
- **[rollup]** Update to v2.61. ([b8bf42b](https://github.com/milesj/packemon/commit/b8bf42b))

**Note:** Version bump only for package packemon

## 1.9.0 - 2021-12-07

#### 🚀 Updates

- Add `api` config setting. (#92) ([2686012](https://github.com/milesj/packemon/commit/2686012)),
  closes [#92](https://github.com/milesj/packemon/issues/92)
- Use subpath patterns for non-bundled exports. (#91)
  ([545409d](https://github.com/milesj/packemon/commit/545409d)), closes
  [#91](https://github.com/milesj/packemon/issues/91)

#### 📦 Dependencies

- **[rollup]** Update to v2.60 latest.
  ([e73d949](https://github.com/milesj/packemon/commit/e73d949))
- Update to latest. ([e398eef](https://github.com/milesj/packemon/commit/e398eef))

**Note:** Version bump only for package packemon

## 1.8.0 - 2021-11-23

#### 🚀 Updates

- Only generate TS declarations when necessary, and per project.
  ([5c72f8a](https://github.com/milesj/packemon/commit/5c72f8a))

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

- **[boost]** Update to v3. (#87) ([5ba2eec](https://github.com/milesj/packemon/commit/5ba2eec)),
  closes [#87](https://github.com/milesj/packemon/issues/87)

**Note:** Version bump only for package packemon

### 1.7.1 - 2021-11-12

#### 📦 Dependencies

- **[react]** Update to v17. ([de2de45](https://github.com/milesj/packemon/commit/de2de45))
- **[rollup]** Update to v2.60. ([c40937f](https://github.com/milesj/packemon/commit/c40937f))

**Note:** Version bump only for package packemon

## 1.7.0 - 2021-11-04

#### 🚀 Updates

- Add a `files` command. (#89) ([42107bd](https://github.com/milesj/packemon/commit/42107bd)),
  closes [#89](https://github.com/milesj/packemon/issues/89)

#### 📦 Dependencies

- **[babel]** Update to v7.16 latest. ([26de0eb](https://github.com/milesj/packemon/commit/26de0eb))
- **[rollup]** Update to v2.59. ([6614760](https://github.com/milesj/packemon/commit/6614760))
- Update minor and patch versions. ([65408c3](https://github.com/milesj/packemon/commit/65408c3))

**Note:** Version bump only for package packemon

## 1.6.0 - 2021-10-12

#### 🚀 Updates

- Support format/platform/support for Babel configs.
  ([7b75b09](https://github.com/milesj/packemon/commit/7b75b09))
- Upgrade Rollup to generate smaller code and utilize ES2015 features.
  ([e6d492a](https://github.com/milesj/packemon/commit/e6d492a))

#### 🐞 Fixes

- Resolve module lookup failures for yarn dlx.
  ([140d3e1](https://github.com/milesj/packemon/commit/140d3e1))

#### 📦 Dependencies

- **[ink]** Update to v3.2. ([c676fa5](https://github.com/milesj/packemon/commit/c676fa5))

**Note:** Version bump only for package packemon

## 1.5.0 - 2021-09-11

#### 🚀 Updates

- Add `scaffold` command and associated templates. (#85)
  ([c9f22af](https://github.com/milesj/packemon/commit/c9f22af)), closes
  [#85](https://github.com/milesj/packemon/issues/85)

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

- Add missing babel-plugin-cjs-esm-interop dep.
  ([77af564](https://github.com/milesj/packemon/commit/77af564))

**Note:** Version bump only for package packemon

## 1.4.0 - 2021-08-28

#### 🚀 Updates

- Migrate to ESM-first source code. (#83)
  ([50ee442](https://github.com/milesj/packemon/commit/50ee442)), closes
  [#83](https://github.com/milesj/packemon/issues/83)

#### 📦 Dependencies

- **[babel]** Update to v7.15. ([2b8d592](https://github.com/milesj/packemon/commit/2b8d592))
- **[beemo-dev]** Update to latest configs.
  ([db6947e](https://github.com/milesj/packemon/commit/db6947e))
- **[boost]** Update to v2 latest. ([bff29df](https://github.com/milesj/packemon/commit/bff29df))
- **[filesize]** Update to v8. ([b78c4d9](https://github.com/milesj/packemon/commit/b78c4d9))
- **[npm-packlist]** Update to v3. ([384edf2](https://github.com/milesj/packemon/commit/384edf2))
- **[rollup]** Update to v2.56. ([222283c](https://github.com/milesj/packemon/commit/222283c))

#### 🛠 Internals

- Upgrade to TypeScript v4.4. ([ff41b61](https://github.com/milesj/packemon/commit/ff41b61))

**Note:** Version bump only for package packemon

## 1.3.0 - 2021-08-02

#### 🚀 Updates

- Support a new `externals` option. (#80)
  ([c935e35](https://github.com/milesj/packemon/commit/c935e35)), closes
  [#80](https://github.com/milesj/packemon/issues/80)

#### 📦 Dependencies

- **[beemo]** Update to v2 latest. ([6534d5b](https://github.com/milesj/packemon/commit/6534d5b))
- **[rollup]** Update to v2.55. ([41e35b6](https://github.com/milesj/packemon/commit/41e35b6))

**Note:** Version bump only for package packemon

## 1.2.0 - 2021-07-17

#### 🚀 Updates

- Add Babel plugin for handling invariant() functions. (#78)
  ([98485ce](https://github.com/milesj/packemon/commit/98485ce)), closes
  [#78](https://github.com/milesj/packemon/issues/78)

#### 🐞 Fixes

- Use `peerDependenciesMeta` instead of `optionalPeerDependencies`.
  ([0d41cd1](https://github.com/milesj/packemon/commit/0d41cd1))

#### 📦 Dependencies

- **[boost]** Update to v2 latest. Improve CLI rendering.
  ([d9677f8](https://github.com/milesj/packemon/commit/d9677f8))
- **[rollup]** Update to v2 latest. ([81fbe88](https://github.com/milesj/packemon/commit/81fbe88))

#### 🛠 Internals

- Migrate to Yarn 2. (#79) ([bf5522a](https://github.com/milesj/packemon/commit/bf5522a)), closes
  [#79](https://github.com/milesj/packemon/issues/79)
- Move Babel plugin to its own package. (#77)
  ([d41deca](https://github.com/milesj/packemon/commit/d41deca)), closes
  [#77](https://github.com/milesj/packemon/issues/77)
- Setup Lerna for releases. ([49acd0e](https://github.com/milesj/packemon/commit/49acd0e))
- Switch to a monorepo. (#76) ([37f4c1d](https://github.com/milesj/packemon/commit/37f4c1d)), closes
  [#76](https://github.com/milesj/packemon/issues/76)
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
