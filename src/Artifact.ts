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

  async run(options: PackemonOptions): Promise<void> {
    const start = Date.now();

    try {
      this.state = 'building';

      await this.preBuild(options);
      await this.build(options);
      await this.postBuild(options);

      this.state = 'passed';
    } catch (error) {
      this.state = 'failed';

      throw error;
    }

    this.result.time = Date.now() - start;
  }

  preBuild(options: PackemonOptions): Awaitable {}

  build(options: PackemonOptions): Awaitable {}

  postBuild(options: PackemonOptions): Awaitable {}

  isComplete(): boolean {
    return this.state === 'passed' || this.state === 'failed';
  }

  isRunning(): boolean {
    return this.state === 'building';
  }

  shouldSkip(): boolean {
    return this.state === 'failed';
  }

  abstract getLabel(): string;

  abstract getTargets(): string[];
}
