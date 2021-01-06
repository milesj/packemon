import os from 'os';
import React from 'react';
import { Arg, Config } from '@boost/cli';
import Build from '../components/Build';
import { AnalyzeType, BuildOptions, DeclarationType } from '../types';
import Command from './Base';

@Config('build', 'Build standardized packages for distribution')
export class BuildCommand extends Command<Required<BuildOptions>> {
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

  @Arg.String('Generate a single TypeScript declaration for each package input', {
    choices: ['none', 'standard', 'api'],
  })
  generateDeclaration: DeclarationType = 'none';

  @Arg.Number('Timeout in milliseconds before a build is cancelled')
  timeout: number = 0;

  run() {
    return (
      <Build
        packemon={this.packemon}
        addEngines={this.addEngines}
        addExports={this.addExports}
        analyzeBundle={this.analyze}
        concurrency={this.concurrency}
        generateDeclaration={this.generateDeclaration}
        skipPrivate={this.skipPrivate}
        timeout={this.timeout}
      />
    );
  }
}
