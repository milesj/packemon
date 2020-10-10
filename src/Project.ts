import { Memoize, Project as BaseProject } from '@boost/common';
import Package from './Package';

export default class Project extends BaseProject {
  workspaces: string[] = [];

  @Memoize()
  getRootPackage(): Package {
    return new Package(this, this.root.append('package.json'), this.getPackage());
  }
}
