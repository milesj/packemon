import { Config } from '@boost/cli';
import { BaseCommand } from './Base';

@Config('clean', 'Clean build artifacts from packages')
export class CleanCommand extends BaseCommand {
  async run() {
    await this.packemon.clean();
  }
}
