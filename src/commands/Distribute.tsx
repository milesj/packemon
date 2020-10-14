// eslint-disable-next-line no-use-before-define
import React from 'react';
import os from 'os';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Distribute from '../components/Distribute';
import Packemon from '../Packemon';
import { PackemonOptions } from '../types';

export type Options = GlobalOptions & PackemonOptions;

export type Params = [string];

@Config('distribute', 'Prepare standardized packages for distribution.')
export default class DistributeCommand extends Command<Options, Params> {
  @Arg.Flag('Add `engine` versions to each `package.json`')
  addEngines: boolean = false;

  @Arg.Flag('Add `exports` fields to each `package.json`')
  addExports: boolean = false;

  @Arg.Flag('Check that packages have a valid `license` field')
  checkLicenses: boolean = false;

  @Arg.Number('Number of packages to run in parallel')
  concurrency: number = os.cpus().length;

  @Arg.Flag('Generate a single TypeScript declaration for each package input')
  generateDeclaration: boolean = false;

  @Arg.Flag('Skip `private` packages from being prepared')
  skipPrivate: boolean = false;

  @Arg.Number('Timeout in milliseconds before a package is cancelled')
  timeout: number = 0;

  @Arg.Params<Params>({
    description: 'Project root that contains a `package.json`',
    label: 'cwd',
    type: 'string',
  })
  run(cwd: string = process.cwd()) {
    const packemon = new Packemon(cwd, {
      addEngines: this.addEngines,
      addExports: this.addExports,
      checkLicenses: this.checkLicenses,
      concurrency: this.concurrency,
      generateDeclaration: this.generateDeclaration,
      skipPrivate: this.skipPrivate,
      timeout: this.timeout,
    });

    return <Distribute packemon={packemon} />;
  }
}
