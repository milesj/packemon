// eslint-disable-next-line unicorn/import-index
import {
  BundleArtifact,
  Format,
  getBabelInputConfig,
  getBabelOutputConfig,
  Platform,
  Project,
  Target,
} from './index';

// Extract attributes from environment
const format = (process.env.PACKEMON_FORMAT || 'lib') as Format;
const platform = (process.env.PACKEMON_PLATFORM || 'node') as Platform;
const target = (process.env.PACKEMON_TARGET || 'legacy') as Target;

const project = new Project(process.cwd());
const artifact = new BundleArtifact(project.rootPackage);
const featureFlags = project.rootPackage.getFeatureFlags();

const inputConfig = getBabelInputConfig(artifact, featureFlags);
const outputConfig = getBabelOutputConfig({ format, platform, target }, featureFlags);

export = {
  babelrc: false,
  comments: false,
  // Input must come first
  plugins: [...inputConfig.plugins!, ...outputConfig.plugins!],
  // preset-env must come first
  presets: [...outputConfig.presets!, ...inputConfig.presets!],
};
