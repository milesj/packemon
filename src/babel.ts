import fs from 'fs-extra';
import { TransformOptions as ConfigStructure } from '@babel/core';
import { Path, toArray } from '@boost/common';
import { FeatureFlags } from './types';
import {
  CodeArtifact,
  DEFAULT_SUPPORT,
  Format,
  getBabelInputConfig,
  getBabelOutputConfig,
  Package,
  PackemonPackage,
  Platform,
  Project,
  Support,
} from '.';

const format = (process.env.PACKEMON_FORMAT ?? 'lib') as Format;
const support = (process.env.PACKEMON_SUPPORT ?? DEFAULT_SUPPORT) as Support;
const project = new Project(process.cwd());

function getBabelConfig(artifact: CodeArtifact, featureFlags: FeatureFlags): ConfigStructure {
  const inputConfig = getBabelInputConfig(artifact, featureFlags);
  const outputConfig = getBabelOutputConfig(
    artifact.platform,
    artifact.support,
    artifact.builds[0].format,
    featureFlags,
  );

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

  if (pkg.packageJson.packemon) {
    pkg.setConfigs(toArray(pkg.packageJson.packemon));
  }

  // Determine the lowest platform to support
  const platforms = pkg.configs.map((config) => config.platform);
  let lowestPlatform: Platform = 'node';

  // istanbul ignore next
  if (platforms.includes('browser')) {
    lowestPlatform = 'browser';
  } else if (platforms.includes('native')) {
    lowestPlatform = 'native';
  }

  // Generate artifact and builds
  const artifact = new CodeArtifact(pkg, [{ format }]);
  artifact.bundle = false;
  artifact.platform = lowestPlatform;
  artifact.support = support;

  return getBabelConfig(artifact, pkg.getFeatureFlags());
}

export function createRootConfig(): ConfigStructure {
  const config = createConfig(process.cwd());

  return {
    ...config,
    babelrc: true,
    babelrcRoots: project.getWorkspaceGlobs({ relative: true }),
    // Support React Native libraries by default
    overrides: [
      {
        presets: ['@babel/preset-flow'],
        test: /node_modules\/((jest-)?react-native|@react-native(-community)?)/iu,
      },
    ],
  };
}
