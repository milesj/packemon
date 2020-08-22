import { Path, Project } from '@boost/common';

export default class Packemon {
  cwd: Path;

  project: Project;

  constructor(cwd: string) {
    this.cwd = Path.create(cwd);
    this.project = new Project(this.cwd);
  }

  gatherPackages() {}

  buildPackages() {}
}
