import { Arg, Config } from '@boost/cli';
import { PackageGraph } from '@boost/common';
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
		const packages = await this.packemon.findPackages({
			filter: this.filter,
			skipPrivate: this.skipPrivate,
		});

		const map = Object.fromEntries(packages.map((pkg) => [pkg.getName(), pkg]));
		const graph = new PackageGraph(packages.map((pkg) => pkg.json));

		for await (const batch of graph.resolveBatchList()) {
			const pipeline = new PooledPipeline(new Context(), undefined, {
				concurrency: this.concurrency,
				timeout: this.timeout,
			});

			batch.forEach((pkgJson) => {
				pipeline.add(pkgJson.name, async () => {
					await run(map[pkgJson.name]);
				});
			});

			const { errors } = await pipeline.run();

			if (errors.length > 0) {
				throw errors[0];
			}
		}
	}
}
