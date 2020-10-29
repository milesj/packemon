import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Packemon from '../Packemon';

export type CleanParams = [string];

@Config('clean', 'Clean build artifacts from packages.')
export class CleanCommand extends Command<GlobalOptions, CleanParams> {
  @Arg.Params<CleanParams>({
    description: 'Project root that contains a `package.json`',
    label: 'cwd',
    type: 'string',
  })
  async run(cwd: string = process.cwd()) {
    await new Packemon(cwd).clean();
  }
}
