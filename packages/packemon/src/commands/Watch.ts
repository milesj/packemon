import { applyStyle, Arg, Config } from '@boost/cli';
import { Bind, formatMs } from '@boost/common';
import { loadModule } from '../helpers/loadModule';
import { Package } from '../Package';
import { BaseCommand } from './Base';

export interface WatchOptions {
	debounce: number;
	poll: boolean;
}

@Config('watch', 'Watch local files for changes and rebuild')
export class WatchCommand extends BaseCommand<WatchOptions> {
	@Arg.Number('Number of milliseconds to wait after a change before triggering a rebuild')
	debounce: number = 150;

	@Arg.Flag('Poll for file changes instead of using file system events')
	poll: boolean = false;

	protected packages: Package[] = [];

	protected packagesToRebuild = new Set<Package>();

	protected rebuilding: boolean = false;

	protected rebuildTimer?: NodeJS.Timeout;

	@Bind()
	enqueueRebuild(event: string, path: string) {
		if (event !== 'add' && event !== 'change' && event !== 'unlink') {
			return;
		}

		this.log(applyStyle(' - %s', 'muted'), path.replace(`${this.packemon.root.path()}/`, ''));

		const changedPkg = this.packages.find((pkg) => path.startsWith(pkg.path.path()));

		if (changedPkg) {
			this.packagesToRebuild.add(changedPkg);
			this.triggerRebuilds();
		}
	}

	async run() {
		const { packemon } = this;
		const chokidar = loadModule(
			'chokidar',
			'Chokidar is required for file watching.',
		) as typeof import('chokidar');

		packemon.debug('Starting `watch` process');

		// Generate all our build artifacts
		this.packages = await packemon.loadConfiguredPackages(this.getBuildOptions());
		this.packages = packemon.generateArtifacts(this.packages);

		// Instantiate the watcher for each package source
		const watchPaths = this.packages.map((pkg) => pkg.path.append('src/**/*').path());

		packemon.debug('Initializing chokidar watcher for paths:');
		packemon.debug(watchPaths.map((path) => ` - ${path}`).join('\n'));

		const watcher = chokidar.watch(watchPaths, {
			ignored: /(^|[/\\])\../u, // dotfiles
			ignoreInitial: true,
			persistent: true,
			usePolling: this.poll,
		});

		// Rebuild when files change
		watcher.on('all', this.enqueueRebuild);

		this.log('Watching for changes...');
	}

	triggerRebuilds() {
		if (this.rebuildTimer) {
			clearTimeout(this.rebuildTimer);
		}

		this.rebuildTimer = setTimeout(() => {
			void this.rebuildPackages();
		}, this.debounce);
	}

	async rebuildPackages() {
		if (this.rebuilding) {
			this.triggerRebuilds();

			return;
		}

		const pkgs = [...this.packagesToRebuild];
		const pkgNames = pkgs.map((pkg) => pkg.getName());

		if (pkgs.length === 0) {
			return;
		}

		this.packagesToRebuild.clear();
		this.rebuilding = true;

		try {
			const start = Date.now();

			await Promise.all(
				pkgs.map(async (pkg) =>
					pkg.build({}, (await this.packemon.config.loadConfigFromBranchToRoot(pkg.path)).config),
				),
			);

			this.log(
				applyStyle('Built %s in %s', 'success'),
				pkgNames.join(', '),
				formatMs(Date.now() - start),
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.log.error(error.message);
			}

			this.log(applyStyle('Failed to build %s', 'failure'), pkgNames.join(', '));
		} finally {
			this.rebuilding = false;
		}
	}
}
