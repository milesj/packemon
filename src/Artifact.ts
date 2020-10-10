import Package from './Package';
import { ArtifactFlags, BuildStatus } from './types';

export default abstract class Artifact {
  flags: ArtifactFlags = {};

  package: Package;

  status: BuildStatus = 'pending';

  constructor(pkg: Package) {
    this.package = pkg;
  }

  get name(): string {
    return this.package.name;
  }

  abstract build(): Promise<void>;
}
