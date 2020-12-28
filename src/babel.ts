// eslint-disable-next-line unicorn/import-index
import {
  BundleArtifact,
  Format,
  getBabelInputConfig,
  getBabelOutputConfig,
  Platform,
  Project,
  Support,
  DEFAULT_FORMAT,
  DEFAULT_SUPPORT,
} from './index';

// Extract attributes from environment
const format = (process.env.PACKEMON_FORMAT || DEFAULT_FORMAT) as Format;
const platform = (process.env.PACKEMON_PLATFORM || 'node') as Platform;
const support = (process.env.PACKEMON_SUPPORT || DEFAULT_SUPPORT) as Support;

const project = new Project(process.cwd());
const artifact = new BundleArtifact(project.rootPackage, [{ format, platform, support }]);
const featureFlags = project.rootPackage.getFeatureFlags();

const inputConfig = getBabelInputConfig(artifact, featureFlags);
const outputConfig = getBabelOutputConfig(artifact.builds[0], featureFlags);

export const config = {
  babelrc: false,
  comments: false,
  overrides: [
    {
      presets: ['@babel/preset-flow'],
      test: /node_modules\/((jest-)?react-native|@react-native(-community)?)/iu,
    },
  ],
  // Input must come first
  plugins: [...inputConfig.plugins!, ...outputConfig.plugins!],
  // preset-env must come first
  presets: [...outputConfig.presets!, ...inputConfig.presets!],
};
