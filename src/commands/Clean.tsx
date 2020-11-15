import { Command, Config, GlobalOptions } from '@boost/cli';
import Packemon from '../Packemon';

@Config('clean', 'Clean build artifacts from packages')
export class CleanCommand extends Command<GlobalOptions> {
  async run() {
    await new Packemon().clean();
  }
}
