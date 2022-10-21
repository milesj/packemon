import { Arg, Config } from '@boost/cli';
import { Context, PooledPipeline } from '@boost/pipeline';
import { Package } from '../Package';
import { BuildCommand } from './Build';

@Config('build-workspace', 'Build all packages across the workspace')
export class BuildWorkspaceCommand extends BuildCommand {
	@Arg.String('Filter packages to build', { category: 'filter' })
	filter: string = '';

	override async run() {
		await this.runPipeline([], this.build);
	}

	protected async runPipeline(pkgs: Package[], run: (pkg: Package) => Promise<unknown>) {
		const pipeline = new PooledPipeline(new Context());

		pipeline.configure({
			concurrency: this.concurrency,
			timeout: this.timeout,
		});

		pkgs.forEach((pkg) => {
			pipeline.add(pkg.getName(), async () => {
				await run(pkg);
			});
		});

		const { errors } = await pipeline.run();

		if (errors.length > 0) {
			throw errors[0];
		}
	}
}
