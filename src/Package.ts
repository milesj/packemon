/* eslint-disable @typescript-eslint/member-ordering */

import { Memoize, Path, toArray } from '@boost/common';
import Artifact from './Artifact';
import Project from './Project';
import resolveTsConfig from './helpers/resolveTsConfig';
import { FeatureFlags, PackemonPackage, Platform, Target } from './types';

export default class Package {
  artifacts: Artifact[] = [];

  contents: PackemonPackage;

  path: Path;

  platforms: Platform[] = [];

  project: Project;

  root: boolean = false;

  target: Target = 'legacy';

  constructor(project: Project, path: Path, contents: PackemonPackage) {
    this.project = project;
    this.path = path;
    this.contents = contents;

    // Workspace root `package.json`s may not have this
    if (contents.packemon) {
      this.platforms = toArray(contents.packemon.platform);
      this.target = contents.packemon.target;
    }
  }

  addArtifact(artifact: Artifact): Artifact {
    this.artifacts.push(artifact);

    return artifact;
  }

  getName(): string {
    return this.contents.name;
  }

  @Memoize()
  getFeatureFlags(): FeatureFlags {
    const flags: FeatureFlags = this.root ? {} : this.project.rootPackage.getFeatureFlags();
    flags.workspaces = this.project.workspaces;

    // React
    if (this.hasDependency('react')) {
      flags.react = true;
    }

    // TypeScript
    const tsconfigPath = this.project.root.append('tsconfig.json');

    if (this.hasDependency('typescript') || tsconfigPath.exists()) {
      flags.typescript = true;
      flags.decorators = Boolean(
        resolveTsConfig(tsconfigPath)?.compilerOptions?.experimentalDecorators,
      );
    }

    // Flow
    const flowconfigPath = this.project.root.append('.flowconfig');

    if (this.hasDependency('flow-bin') || flowconfigPath.exists()) {
      flags.flow = true;
    }

    return flags;
  }

  getJsonPath(): Path {
    return this.path.append('package.json');
  }

  hasDependency(name: string): boolean {
    const pkg = this.contents;

    return Boolean(
      pkg.dependencies?.[name] ||
        pkg.devDependencies?.[name] ||
        pkg.peerDependencies?.[name] ||
        pkg.optionalDependencies?.[name],
    );
  }

  isComplete(): boolean {
    return this.artifacts.every((artifact) => artifact.isComplete());
  }

  isRunning(): boolean {
    return this.artifacts.some((artifact) => artifact.isRunning());
  }
}
