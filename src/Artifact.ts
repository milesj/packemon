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
      this.state = 'booting';
      await this.boot(options);

      this.state = 'building';
      await this.build(options);

      this.state = 'packing';
      await this.pack(options);

      this.state = 'passed';
    } catch (error) {
      this.state = 'failed';

      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    this.result.time = Date.now() - start;
  }

  boot(options: PackemonOptions): Awaitable {}

  build(options: PackemonOptions): Awaitable {}

  pack(options: PackemonOptions): Awaitable {}

  isComplete(): boolean {
    return this.state === 'passed' || this.state === 'failed';
  }

  isRunning(): boolean {
    return this.state === 'booting' || this.state === 'building' || this.state === 'packing';
  }

  shouldSkip(): boolean {
    return this.state === 'failed';
  }

  abstract getLabel(): string;

  abstract getBuilds(): string[];
}
