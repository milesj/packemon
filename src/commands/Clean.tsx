import { Config } from '@boost/cli';
import Command from './Base';

@Config('clean', 'Clean build artifacts from packages')
export class CleanCommand extends Command {
  async run() {
    await this.packemon.clean();
  }
}
