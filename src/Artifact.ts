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

  abstract build(): Promise<void>;

  abstract getLabel(): string;

  abstract getBuilds(): string[];
}
