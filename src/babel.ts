import fs from 'fs-extra';
import { TransformOptions as ConfigStructure } from '@babel/core';
import { Path, toArray } from '@boost/common';
// eslint-disable-next-line unicorn/import-index
import {
  BundleArtifact,
  DEFAULT_FORMAT,
  DEFAULT_SUPPORT,
  Format,
  getBabelInputConfig,
  getBabelOutputConfig,
  Package,
  PackemonPackage,
  Platform,
  Project,
  Support,
} from './index';
import { FeatureFlags } from './types';

const format = (process.env.PACKEMON_FORMAT || DEFAULT_FORMAT) as Format;
const platform = (process.env.PACKEMON_PLATFORM || 'node') as Platform;
const support = (process.env.PACKEMON_SUPPORT || DEFAULT_SUPPORT) as Support;
const project = new Project(process.cwd());

function getBabelConfig(artifact: BundleArtifact, featureFlags: FeatureFlags): ConfigStructure {
  const inputConfig = getBabelInputConfig(artifact, featureFlags);
  const outputConfig = getBabelOutputConfig(artifact.builds[0], featureFlags);

  return {
    // Input must come first
    plugins: [...inputConfig.plugins!, ...outputConfig.plugins!],
    // Env must come first
    presets: [...outputConfig.presets!, ...inputConfig.presets!],
  };
}

export function createConfig(folder: string): ConfigStructure {
  const path = new Path(folder);
  const contents = fs.readJsonSync(path.append('package.json').path()) as PackemonPackage;

  // Create package and configs
  const pkg = new Package(project, path, contents);
  const platforms: Platform[] = [];

  pkg.setConfigs(toArray(pkg.packageJson.packemon));

  pkg.configs.forEach((config) => {
    platforms.push(...config.platforms);
  });

  // Create artifact and builds
  const artifact = new BundleArtifact(pkg, [
    BundleArtifact.generateBuild(format, support, platforms),
  ]);

  return getBabelConfig(artifact, pkg.getFeatureFlags());
}

export function createRootConfig(): ConfigStructure {
  const artifact = new BundleArtifact(project.rootPackage, [{ format, platform, support }]);
  const config = getBabelConfig(artifact, project.rootPackage.getFeatureFlags());

  return {
    ...config,
    babelrc: true,
    // Support React Native libraries by default
    overrides: [
      {
        presets: ['@babel/preset-flow'],
        test: /node_modules\/((jest-)?react-native|@react-native(-community)?)/iu,
      },
    ],
  };
}
