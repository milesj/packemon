import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Packemon from './Packemon';
import { PackemonOptions } from './types';

export type Options = GlobalOptions & PackemonOptions;

export type Params = [string];

@Config('packemon', 'Build standardized packages for distribution.')
export default class PackemonCommand extends Command<Options, Params> {
  @Arg.Flag('Add an `exports` field to `package.json` based on the build', { category: 'node' })
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
  async run(cwd: string = process.cwd()) {
    const packer = new Packemon(cwd, {
      addExports: this.addExports,
      checkLicenses: this.checkLicenses,
      skipPrivate: this.skipPrivate,
    });

    await packer.pack();
  }
}
