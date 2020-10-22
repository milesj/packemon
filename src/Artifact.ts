import Package from './Package';
import { ArtifactState, Awaitable, Build, BuildResult, BuildOptions } from './types';

export default abstract class Artifact<T = unknown> {
  readonly builds: Build<T>[] = [];

  readonly buildResult: BuildResult = { time: 0 };

  readonly package: Package;

  state: ArtifactState = 'pending';

  constructor(pkg: Package, builds: Build<T>[] = []) {
    this.package = pkg;
    this.builds = builds;
  }

  cleanup(): Awaitable {}

  build(options: BuildOptions): Awaitable {}

  isComplete(): boolean {
    return this.state === 'passed' || this.state === 'failed';
  }

  isRunning(): boolean {
    return this.state === 'building';
  }

  postBuild(options: BuildOptions): Awaitable {}

  preBuild(options: BuildOptions): Awaitable {}

  shouldSkip(): boolean {
    return this.state === 'failed';
  }

  abstract getLabel(): string;

  abstract getBuildTargets(): string[];

  abstract toString(): string;
}
