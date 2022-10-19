import { Config } from '@boost/cli';
import { BuildCommand } from './Build';

@Config('pack', 'Clean, build, and validate packages for distribution')
export class PackCommand extends BuildCommand {
	override async run() {
		await this.runProgram(['clean']);
		await this.build();
		await this.runProgram(['validate']);
	}
}
