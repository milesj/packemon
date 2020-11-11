import React from 'react';
import os from 'os';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Build from '../components/Build';
import Packemon from '../Packemon';
import { BuildOptions } from '../types';

export type BuildParams = [string];

@Config('build', 'Build standardized packages for distribution.')
export class BuildCommand extends Command<GlobalOptions & BuildOptions, BuildParams> {
  @Arg.Flag('Add `engine` versions to each `package.json`')
  addEngines: boolean = false;

  @Arg.Flag('Add `exports` fields to each `package.json`')
  addExports: boolean = false;

  @Arg.String('Visualize and analyze all generated builds', {
    choices: ['sunburst', 'treemap', 'network'],
  })
  analyze: string = '';

  @Arg.Number('Number of builds to run in parallel')
  concurrency: number = os.cpus().length;

  @Arg.Flag('Generate a single TypeScript declaration for each package input')
  generateDeclaration: boolean = false;

  @Arg.Flag('Skip `private` packages from being built')
  skipPrivate: boolean = false;

  @Arg.Number('Timeout in milliseconds before a build is cancelled')
  timeout: number = 0;

  @Arg.Flag('Validate fields in each `package.json`')
  validate: boolean = false;

  @Arg.Params<BuildParams>({
    description: 'Project root that contains a `package.json`',
    label: 'cwd',
    type: 'string',
  })
  run(cwd: string = process.cwd()) {
    return (
      <Build
        packemon={new Packemon(cwd)}
        addEngines={this.addEngines}
        addExports={this.addExports}
        analyzeBundle={this.analyze}
        concurrency={this.concurrency}
        generateDeclaration={this.generateDeclaration}
        skipPrivate={this.skipPrivate}
        timeout={this.timeout}
        validate={this.validate}
      />
    );
  }
}
