import { Config } from '@boost/cli';
import { BuildCommand } from './Build';

@Config('pack', 'Clean, build, and validate packages for distribution')
export class PackCommand extends BuildCommand {
	override async run() {
		if (!process.env.NODE_ENV) {
			process.env.NODE_ENV = 'production';
		}

		await this.pack(await this.getPackage());
	}
}
