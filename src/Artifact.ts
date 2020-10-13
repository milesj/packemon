/* eslint-disable no-empty-function */

import Package from './Package';
import {
  ArtifactFlags,
  ArtifactState,
  BootOptions,
  BuildOptions,
  BuildResult,
  PackOptions,
} from './types';

export default abstract class Artifact<T = unknown> {
  flags: ArtifactFlags = {};

  package: Package;

  result?: BuildResult<T>;

  state: ArtifactState = 'pending';

  constructor(pkg: Package) {
    this.package = pkg;
  }

  async boot(options: BootOptions): Promise<void> {}

  async build(options: BuildOptions): Promise<void> {}

  async pack(options: PackOptions): Promise<void> {}

  isComplete(): boolean {
    return this.state === 'passed' || this.state === 'failed' || this.state === 'skipped';
  }

  isRunning(): boolean {
    return this.state === 'booting' || this.state === 'building' || this.state === 'packing';
  }

  shouldSkip(): boolean {
    return this.state === 'skipped' || this.state === 'failed';
  }

  abstract getLabel(): string;

  abstract getBuilds(): string[];
}
