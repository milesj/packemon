import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Packemon from '../Packemon';
import { ValidateOptions } from '../types';

export type ValidateParams = [string];

@Config('validate', 'Validate `package.json` from packages.')
export class ValidateCommand extends Command<GlobalOptions & ValidateOptions, ValidateParams> {
  @Arg.Flag('Check that dependencies have valid versions and constraints')
  deps: boolean = true;

  @Arg.Flag('Check that the current runtime satisfies `engines` constraint')
  engines: boolean = true;

  @Arg.Flag('Check that `main`, `module`, and other entry points are valid paths')
  entries: boolean = true;

  @Arg.Flag('Check that a SPDX license is provided')
  license: boolean = true;

  @Arg.Flag('Check that `homepage` and `bugs` links are valid URLs')
  links: boolean = true;

  @Arg.Flag('Check that `author` and `contributors` contain a name and optional URL')
  people: boolean = true;

  @Arg.Flag('Check that `repository` exists and is a valid URL')
  repo: boolean = true;

  @Arg.Params<ValidateParams>({
    description: 'Project root that contains a `package.json`',
    label: 'cwd',
    type: 'string',
  })
  async run(cwd: string = process.cwd()) {
    await new Packemon(cwd).validate({
      deps: this.deps,
      engines: this.engines,
      entries: this.entries,
      license: this.license,
      links: this.links,
      people: this.people,
      repo: this.repo,
    });
  }
}
