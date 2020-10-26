import fs from 'fs-extra';
import { applyStyle } from '@boost/cli';
import { Path } from '@boost/common';
import Package from './Package';
import { ArtifactState, Awaitable, BuildResult, BuildOptions } from './types';

export default abstract class Artifact<T extends object = {}> {
  readonly builds: T[] = [];

  readonly buildResult: BuildResult = { time: 0 };

  readonly filesToCleanup: string[] = [];

  readonly package: Package;

  state: ArtifactState = 'pending';

  constructor(pkg: Package, builds: T[]) {
    this.package = pkg;
    this.builds = builds;
  }

  async cleanup(): Promise<void> {
    await Promise.all(this.filesToCleanup.map((file) => fs.remove(file)));
  }

  build(options: BuildOptions): Awaitable {}

  isComplete(): boolean {
    return this.state === 'passed' || this.state === 'failed';
  }

  isRunning(): boolean {
    return this.state === 'building';
  }

  postBuild(options: BuildOptions): Awaitable {}

  preBuild(options: BuildOptions): Awaitable {}

  shouldSkip(): boolean {
    return this.state === 'failed';
  }

  protected logWithSource(
    message: string,
    level: 'info' | 'warn' | 'error',
    {
      id,
      output,
      sourceColumn,
      sourceFile,
      sourceLine,
    }: {
      id?: string;
      output?: string;
      sourceColumn?: number;
      sourceFile?: string;
      sourceLine?: number;
    } = {},
  ) {
    let msg = `[${this.package.getName()}${output ? `/${output}` : ''}] ${message}`;

    const meta: string[] = [];

    if (id) {
      meta.push(`id=${id}`);
    }

    if (sourceFile) {
      meta.push(
        `file=${new Path(sourceFile)
          .path()
          .replace(this.package.project.root.path(), '')
          .slice(1)}`,
      );
    }

    if (sourceFile || sourceColumn) {
      meta.push(`line=${sourceLine ?? '?'}:${sourceColumn ?? '?'}`);
    }

    if (meta.length > 0) {
      msg += applyStyle(` (${meta.join(' ')})`, 'muted');
    }

    console[level](msg);
  }

  abstract getLabel(): string;

  abstract getBuildTargets(): string[];

  abstract toString(): string;
}
