import { Path } from '@boost/common';
import { RollupCache } from 'rollup';
import resolveTsConfig from './helpers/resolveTsConfig';
import {
  BuildFlags,
  Format,
  PackemonPackage,
  Platform,
  BuildResult,
  BuildStatus,
  Target,
  FeatureFlags,
} from './types';

export default class Build {
  cache?: RollupCache;

  flags: BuildFlags = {};

  formats: Format[] = [];

  inputName: string = '';

  inputPath: string = '';

  meta: {
    namespace: string;
    workspaces: string[];
  };

  package: PackemonPackage;

  packagePath: Path;

  platforms: Platform[] = [];

  result?: BuildResult;

  root: Path;

  status: BuildStatus = 'pending';

  target: Target = 'legacy';

  constructor(root: Path, pkg: PackemonPackage, workspaces: string[]) {
    this.root = root;
    this.package = pkg;
    this.meta = {
      namespace: '',
      workspaces,
    };

    // Root workspace `package.json`s may not have this config block,
    // but we need to load and parse them to extract feature flags.
    this.packagePath = pkg.packemon?.path;
  }

  get name(): string {
    let { name } = this.package;

    if (this.inputName !== 'index') {
      name += '/';
      name += this.inputName;
    }

    return name;
  }

  getFeatureFlags(): FeatureFlags {
    const flags: FeatureFlags = {
      workspaces: this.meta.workspaces,
    };

    // React
    if (this.hasDependency('react')) {
      flags.react = true;
    }

    // TypeScript
    const tsconfigPath = this.root.append('tsconfig.json');

    if (this.hasDependency('typescript') || tsconfigPath.exists()) {
      flags.typescript = true;
      flags.decorators = Boolean(
        resolveTsConfig(tsconfigPath)?.compilerOptions?.experimentalDecorators,
      );
    }

    // Flow
    const flowconfigPath = this.root.append('.flowconfig');

    if (this.hasDependency('flow-bin') || flowconfigPath.exists()) {
      flags.flow = true;
    }

    return flags;
  }

  hasDependency(name: string): boolean {
    const pkg = this.package;

    return Boolean(
      pkg.dependencies?.[name] ||
        pkg.devDependencies?.[name] ||
        pkg.peerDependencies?.[name] ||
        pkg.optionalDependencies?.[name],
    );
  }
}
