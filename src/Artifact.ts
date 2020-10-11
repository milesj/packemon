/* eslint-disable no-empty-function */

import Package from './Package';
import { ArtifactFlags, BuildResult, ArtifactState } from './types';

export default abstract class Artifact {
  flags: ArtifactFlags = {};

  package: Package;

  result?: BuildResult;

  state: ArtifactState = 'pending';

  constructor(pkg: Package) {
    this.package = pkg;
  }

  async boot(): Promise<void> {}

  async build(): Promise<void> {}

  async pack(): Promise<void> {}

  isRunning(): boolean {
    return this.state === 'booting' || this.state === 'building' || this.state === 'packing';
  }

  shouldSkip(): boolean {
    return this.state === 'skipped' || this.state === 'failed';
  }

  abstract getLabel(): string;

  abstract getBuilds(): string[];
}
