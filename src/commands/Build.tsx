import os from 'os';
import React from 'react';
import { Arg, Config } from '@boost/cli';
import { Build } from '../components/Build';
import { AnalyzeType, BuildOptions, DeclarationType } from '../types';
import { BaseCommand } from './Base';

@Config('build', 'Build standardized packages for distribution')
export class BuildCommand extends BaseCommand<Required<BuildOptions>> {
  @Arg.Flag('Add `engine` versions to each `package.json`')
  addEngines: boolean = false;

  @Arg.Flag('Add `exports` fields to each `package.json`')
  addExports: boolean = false;

  @Arg.String('Visualize and analyze all generated builds', {
    choices: ['none', 'sunburst', 'treemap', 'network'],
  })
  analyze: AnalyzeType = 'none';

  @Arg.Number('Number of builds to run in parallel')
  concurrency: number = os.cpus().length;

  @Arg.String('Generate TypeScript declarations for each package', {
    choices: ['none', 'standard', 'api'],
  })
  declaration: DeclarationType = 'none';

  @Arg.Number('Timeout in milliseconds before a build is cancelled')
  timeout: number = 0;

  run() {
    return (
      <Build
        packemon={this.packemon}
        addEngines={this.addEngines}
        addExports={this.addExports}
        analyze={this.analyze}
        concurrency={this.concurrency}
        declaration={this.declaration}
        skipPrivate={this.skipPrivate}
        timeout={this.timeout}
      />
    );
  }
}
