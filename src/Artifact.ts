import Package from './Package';
import { ArtifactFlags, ArtifactState, Awaitable, BuildResult, PackemonOptions } from './types';

export default abstract class Artifact<T = unknown> {
  readonly flags: ArtifactFlags;

  readonly package: Package;

  readonly result: BuildResult<T> = {
    stats: {},
    time: 0,
  };

  state: ArtifactState = 'pending';

  constructor(pkg: Package, flags: ArtifactFlags = {}) {
    this.package = pkg;
    this.flags = flags;
  }

  cleanup(): Awaitable {}

  build(options: PackemonOptions): Awaitable {}

  isComplete(): boolean {
    return this.state === 'passed' || this.state === 'failed';
  }

  isRunning(): boolean {
    return this.state === 'building';
  }

  postBuild(options: PackemonOptions): Awaitable {}

  preBuild(options: PackemonOptions): Awaitable {}

  shouldSkip(): boolean {
    return this.state === 'failed';
  }

  abstract getLabel(): string;

  abstract getTargets(): string[];

  abstract toString(): string;
}
