import { Memoize, Project as BaseProject } from '@boost/common';
import Package from './Package';

export default class Project extends BaseProject {
  workspaces: string[] = [];

  @Memoize()
  get rootPackage(): Package {
    const pkg = new Package(this, this.root, this.getPackage());
    pkg.root = true;

    return pkg;
  }
}
