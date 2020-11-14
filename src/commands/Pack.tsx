import React from 'react';
import { Arg, Config } from '@boost/cli';
import Build from '../components/Build';
import Packemon from '../Packemon';
import { BuildCommand } from './Build';

export type PackParams = [string];

@Config('pack', 'Clean, build, and validate packages for distribution')
export class PackCommand extends BuildCommand {
  @Arg.Params<PackParams>({
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
      />
    );
  }
}
