import React from 'react';
import os from 'os';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Build from '../components/Build';
import Packemon from '../Packemon';
import { AnalyzeType, BuildOptions, DeclarationType } from '../types';

@Config('build', 'Build standardized packages for distribution')
export class BuildCommand extends Command<GlobalOptions & Required<BuildOptions>> {
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

  @Arg.Flag('Skip `private` packages from being built')
  skipPrivate: boolean = false;

  @Arg.Number('Timeout in milliseconds before a build is cancelled')
  timeout: number = 0;

  run() {
    return (
      <Build
        packemon={new Packemon()}
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
