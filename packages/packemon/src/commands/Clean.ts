import { Config } from '@boost/cli';
import { BaseCommand } from './Base';

@Config('clean', 'Clean build artifacts from a package')
export class CleanCommand extends BaseCommand {
	async run() {
		const pkg = await this.getPackage();

		await this.packemon.clean(pkg);
	}
}
