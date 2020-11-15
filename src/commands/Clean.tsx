import { Command, Config, GlobalOptions } from '@boost/cli';
import Packemon from '../Packemon';

export type CleanParams = [string];

@Config('clean', 'Clean build artifacts from packages')
export class CleanCommand extends Command<GlobalOptions, CleanParams> {
  async run() {
    await new Packemon().clean();
  }
}
