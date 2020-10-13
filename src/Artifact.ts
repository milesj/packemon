/* eslint-disable no-empty-function */

import Package from './Package';
import {
  ArtifactFlags,
  ArtifactState,
  Awaitable,
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

  boot(options: BootOptions): Awaitable {}

  build(options: BuildOptions): Awaitable {}

  pack(options: PackOptions): Awaitable {}

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
