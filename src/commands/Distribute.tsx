// eslint-disable-next-line no-use-before-define
import React from 'react';
import os from 'os';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Distribute from '../components/Distribute';
import Packemon from '../Packemon';
import { PackemonOptions } from '../types';

export type Options = GlobalOptions & PackemonOptions;

export type Params = [string];

@Config('distribute', 'Build and prepare standardized packages for distribution.')
export default class DistributeCommand extends Command<Options, Params> {
  @Arg.Flag('Add `main`, `browser`, and `exports` fields to `package.json`')
  addExports: boolean = false;

  @Arg.Flag('Check that packages have a valid `license` field')
  checkLicenses: boolean = false;

  @Arg.Number('Number of builds to run in parallel')
  concurrency: number = os.cpus().length;

  @Arg.Flag('Generate a single TypeScript declaration for each package')
  generateDeclaration: boolean = false;

  @Arg.Flag('Skip `private` packages from being built')
  skipPrivate: boolean = false;

  @Arg.Number('Timeout in milliseconds before a build is cancelled')
  timeout: number = 0;

  @Arg.Params<Params>({
    description: 'Project root that contains a `package.json`',
    label: 'cwd',
    type: 'string',
  })
  run(cwd: string = process.cwd()) {
    const packemon = new Packemon(cwd, {
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
