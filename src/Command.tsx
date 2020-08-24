import React from 'react';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Main from './components/Main';
import Packemon from './Packemon';
import { PackemonOptions } from './types';

export type Options = GlobalOptions & PackemonOptions;

export type Params = [string];

@Config('packemon', 'Build standardized packages for distribution.')
export default class PackemonCommand extends Command<Options, Params> {
  @Arg.Flag('Add `main` and `exports` fields to every `package.json`')
  addExports: boolean = false;

  @Arg.Flag('Check that packages have a valid `license` field')
  checkLicenses: boolean = false;

  @Arg.Flag('Skip `private` packages from being built')
  skipPrivate: boolean = false;

  @Arg.Params<Params>({
    description: 'Project root that contains a `package.json`',
    label: 'cwd',
    type: 'string',
  })
  run(cwd?: string) {
    const packemon = new Packemon(cwd || process.cwd(), {
      addExports: this.addExports,
      checkLicenses: this.checkLicenses,
      skipPrivate: this.skipPrivate,
    });

    return <Main packemon={packemon} />;
  }
}
