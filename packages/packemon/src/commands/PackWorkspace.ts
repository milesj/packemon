import { Config } from '@boost/cli';
import { BuildWorkspaceCommand } from './BuildWorkspace';

@Config('pack-workspace', 'Clean, build, and validate all packages across the workspace')
export class PackWorkspaceCommand extends BuildWorkspaceCommand {
	override async run() {
		if (!process.env.NODE_ENV) {
			process.env.NODE_ENV = 'production';
		}

		await this.runPipeline(this.pack.bind(this));
	}
}
