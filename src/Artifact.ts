/* eslint-disable no-empty-function */

import Package from './Package';
import { ArtifactFlags, BuildResult, BuildStatus } from './types';

export default abstract class Artifact {
  flags: ArtifactFlags = {};

  package: Package;

  result?: BuildResult;

  status: BuildStatus = 'pending';

  constructor(pkg: Package) {
    this.package = pkg;
  }

  async boot(): Promise<void> {}

  async build(): Promise<void> {}

  async pack(): Promise<void> {}

  isRunning(): boolean {
    return this.status === 'booting' || this.status === 'building' || this.status === 'packing';
  }

  shouldSkip(): boolean {
    return this.status === 'skipped' || this.status === 'failed';
  }

  abstract getLabel(): string;

  abstract getBuilds(): string[];
}
