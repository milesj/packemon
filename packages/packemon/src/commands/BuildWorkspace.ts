import { Arg, Config } from '@boost/cli';
import { Context, PooledPipeline } from '@boost/pipeline';
import { Package } from '../Package';
import { BuildCommand } from './Build';

@Config('build-workspace', 'Build all packages across the workspace')
export class BuildWorkspaceCommand extends BuildCommand {
	@Arg.String('Filter packages to build', { category: 'filter' })
	filter: string = '';

	override async run() {
		await this.runPipeline(this.build.bind(this));
	}

	protected async runPipeline(run: (pkg: Package) => Promise<unknown>) {
		const pipeline = new PooledPipeline(new Context());
		const packages = await this.packemon.findPackages({
			filter: this.filter,
			skipPrivate: this.skipPrivate,
		});

		pipeline.configure({
			concurrency: this.concurrency,
			timeout: this.timeout,
		});

		packages.forEach((pkg) => {
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
