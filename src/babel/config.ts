import { PluginItem, TransformOptions as ConfigStructure } from '@babel/core';
import { BROWSER_TARGETS, NODE_SUPPORTED_VERSIONS } from '../constants';
import { Support, Format, Platform, FeatureFlags, BundleBuild } from '../types';
import BundleArtifact from '../BundleArtifact';

// https://babeljs.io/docs/en/babel-preset-env
export interface PresetEnvOptions {
  browserslistEnv?: string;
  bugfixes?: boolean;
  corejs?: 2 | 3 | { version: 2 | 3; proposals: boolean };
  debug?: boolean;
  exclude?: string[];
  forceAllTransforms?: boolean;
  ignoreBrowserslistConfig?: boolean;
  include?: string[];
  loose?: boolean;
  modules?: 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false;
  shippedProposals?: boolean;
  spec?: boolean;
  targets?: string | string[] | { [key: string]: string | string[] };
  useBuiltIns?: 'usage' | 'entry' | false;
}

// Babel resolves plugins against the current working directory
// and will not find globally installed dependencies unless we resolve.
function resolve(path: string) {
  return require.resolve(path);
}

function getPlatformEnvOptions(
  platform: Platform,
  support: Support,
  format: Format,
): PresetEnvOptions {
  let modules: PresetEnvOptions['modules'] = false;

  if (format === 'umd') {
    modules = 'umd';
  } else if (format === 'cjs' || format === 'lib') {
    modules = 'cjs';
  }

  switch (platform) {
    case 'node':
      return {
        // Async/await has been available since v7
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
        modules,
        targets: {
          node: process.env.NODE_ENV === 'test' ? 'current' : NODE_SUPPORTED_VERSIONS[support],
        },
      };

    case 'browser':
      return {
        modules,
        targets: { browsers: BROWSER_TARGETS[support] },
      };

    default:
      throw new Error(`Unknown platform "${platform}".`);
  }
}

function getSharedConfig(
  plugins: PluginItem[],
  presets: PluginItem[],
  features: FeatureFlags,
): ConfigStructure {
  return {
    caller: {
      name: 'packemon',
    },
    comments: false,
    parserOpts: {
      sourceType: 'unambiguous',
      strictMode: features.strict,
    },
    plugins,
    presets,
    // Do NOT load root `babel.config.js` as we need full control
    configFile: false,
    // Do load branch `.babelrc.js` files for granular customization
    babelrc: true,
    babelrcRoots: features.workspaces,
  };
}

// The input config should only parse special syntax, not transform and downlevel.
// This applies to all formats within a build target.
export function getBabelInputConfig(
  artifact: BundleArtifact,
  features: FeatureFlags,
): Omit<ConfigStructure, 'include' | 'exclude'> {
  const plugins: PluginItem[] = [];
  const presets: PluginItem[] = [];

  if (features.flow) {
    presets.push([resolve('@babel/preset-flow'), { allowDeclareFields: true }]);
  }

  if (features.typescript) {
    presets.push([resolve('@babel/preset-typescript'), { allowDeclareFields: true }]);

    // When decorators are used, class properties must be loose
    if (features.decorators) {
      plugins.push(
        [resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        [resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
        [resolve('@babel/plugin-proposal-private-methods'), { loose: true }],
      );

      if (artifact.package.hasDependency('@babel/plugin-proposal-private-property-in-object')) {
        plugins.push([
          resolve('@babel/plugin-proposal-private-property-in-object'),
          { loose: true },
        ]);
      }
    }
  }

  if (features.react) {
    presets.push([
      resolve('@babel/preset-react'),
      {
        development: process.env.NODE_ENV === 'development',
        throwIfNamespace: true,
      },
    ]);
  }

  return getSharedConfig(plugins, presets, features);
}

// The output config does all the transformation and downleveling through the preset-env.
// This is handled per output since we need to configure based on target + format combinations.
export function getBabelOutputConfig(
  { format, platform, support }: BundleBuild,
  features: FeatureFlags,
): ConfigStructure {
  const plugins: PluginItem[] = [];
  const presets: PluginItem[] = [];
  const isFuture = support !== 'legacy' && support !== 'stable';

  // ENVIRONMENT

  const envOptions: PresetEnvOptions = {
    // Prefer spec compliance over speed
    spec: true,
    loose: false,
    // Consumers must polyfill accordingly
    useBuiltIns: false,
    // Transform features accordingly
    bugfixes: true,
    shippedProposals: true,
    // Platform specific
    ...getPlatformEnvOptions(platform, support, format),
  };

  presets.push([resolve('@babel/preset-env'), envOptions]);

  // PLUGINS

  // Use `Object.assign` when available
  // https://babeljs.io/docs/en/babel-plugin-transform-destructuring#usebuiltins
  if (isFuture) {
    plugins.push(
      [resolve('@babel/plugin-transform-destructuring'), { useBuiltIns: true }],
      [resolve('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true }],
    );
  }

  // Transform async/await into Promises for browsers
  if (platform === 'browser') {
    plugins.push([
      resolve('babel-plugin-transform-async-to-promises'),
      { inlineHelpers: true, target: isFuture ? 'es6' : 'es5' },
    ]);
  }

  // Support `__DEV__` shortcuts
  plugins.push([resolve('babel-plugin-transform-dev'), { evaluate: false }]);

  return getSharedConfig(plugins, presets, features);
}
