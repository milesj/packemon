import { PluginItem, TransformOptions as ConfigStructure } from '@babel/core';
import { BROWSER_TARGETS, NODE_TARGETS } from '../constants';
import { Target, Format, Platform, FeatureFlags, BuildUnit } from '../types';

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

function getPlatformEnvOptions(
  platform: Platform,
  target: Target,
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
        modules,
        targets: { node: NODE_TARGETS[target] },
      };

    case 'browser':
      return {
        modules,
        targets: { browsers: BROWSER_TARGETS[target] },
      };

    default:
      throw new Error(`Unknown platform "${platform}".`);
  }
}

export default function getBabelConfig(
  build: BuildUnit | null,
  features: FeatureFlags,
): Omit<ConfigStructure, 'include' | 'exclude'> {
  const plugins: PluginItem[] = [];
  const presets: PluginItem[] = [];

  // ENVIRONMENT

  // This must be determined first before we add other presets or plugins
  if (build) {
    const { format, platform, target } = build;
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
      ...getPlatformEnvOptions(platform, target, format),
    };

    presets.push(['@babel/preset-env', envOptions]);
  }

  // PRESETS

  if (features.flow) {
    presets.push(['@babel/preset-flow', { allowDeclareFields: true }]);
  }

  if (features.typescript) {
    presets.push(['@babel/preset-typescript', { allowDeclareFields: true }]);

    // When decorators are used, class properties must be loose
    if (features.decorators) {
      plugins.push(
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        // TODO
        // ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      );
    }
  }

  if (features.react) {
    presets.push([
      '@babel/preset-react',
      {
        development: process.env.NODE_ENV === 'development',
        throwIfNamespace: true,
      },
    ]);
  }

  // PLUGINS

  // Use `Object.assign` when available
  // https://babeljs.io/docs/en/babel-plugin-transform-destructuring#usebuiltins
  if (build?.target !== 'legacy') {
    plugins.push(
      ['@babel/plugin-transform-destructuring', { useBuiltIns: true }],
      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    );
  }

  // Support `__DEV__` shortcuts
  plugins.push(['babel-plugin-transform-dev', { evaluate: false }]);

  return {
    caller: {
      name: 'packemon',
    },
    comments: false,
    plugins,
    presets,
    // Do NOT load root `babel.config.js` as we need full control
    configFile: false,
    // Do load branch `.babelrc.js` files for granular customization
    babelrc: true,
    babelrcRoots: features.workspaces,
  };
}
