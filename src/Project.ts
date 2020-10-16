import execa from 'execa';
import { Memoize, Project as BaseProject } from '@boost/common';
import Package from './Package';

export default class Project extends BaseProject {
  workspaces: string[] = [];

  private buildPromise?: Promise<unknown>;

  isWorkspacesEnabled(): boolean {
    return this.workspaces.length > 0;
  }

  async generateDeclarations(): Promise<unknown> {
    if (this.buildPromise) {
      return this.buildPromise;
    }

    const args: string[] = [];

    if (this.isWorkspacesEnabled()) {
      args.push('--build', '--incremental');
    } else {
      args.push('--declaration', '--declarationMap', '--emitDeclarationOnly');
    }

    // Store the promise so parallel artifacts can rely on the same build
    this.buildPromise = execa('tsc', args, {
      cwd: this.root.path(),
      preferLocal: true,
    });

    const result = await this.buildPromise;

    // Remove the promise so the build can be ran again
    this.buildPromise = undefined;

    return result;
  }

  @Memoize()
  get rootPackage(): Package {
    const pkg = new Package(this, this.root, this.getPackage());
    pkg.root = true;

    return pkg;
  }
}
