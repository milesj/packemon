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

	protected package: Package | null = null;

	protected rebuild: boolean = false;

	protected rebuilding: boolean = false;

	protected rebuildTimer?: NodeJS.Timeout;

	@Bind()
	enqueueRebuild(event: string, path: string) {
		if (event !== 'add' && event !== 'change' && event !== 'unlink') {
			return;
		}

		this.log(applyStyle(' - %s', 'muted'), path.replace(`${this.packemon.workingDir.path()}/`, ''));
		this.triggerRebuild();
	}

	async run() {
		const { packemon } = this;
		const chokidar = loadModule(
			'chokidar',
			'Chokidar is required for file watching.',
		) as typeof import('chokidar');

		packemon.debug('Starting `watch` process');

		// Generate all our build artifacts
		this.package = await packemon.loadPackage();

		if (!this.package) {
			throw new Error('No package to watch.');
		}

		// Instantiate the watcher for each package source
		const watchPaths = this.package.path.append('src/**/*').path();

		packemon.debug('Initializing chokidar watcher for paths:');
		packemon.debug(watchPaths);

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

	triggerRebuild() {
		if (this.rebuildTimer) {
			clearTimeout(this.rebuildTimer);
		}

		this.rebuildTimer = setTimeout(() => {
			void this.rebuildPackage();
		}, this.debounce);
	}

	async rebuildPackage() {
		if (this.rebuilding) {
			this.triggerRebuild();

			return;
		}

		if (!this.package) {
			return;
		}

		this.rebuilding = true;

		try {
			const start = Date.now();

			if (this.loadConfigs) {
				const { config } = await this.packemon.config.loadConfigFromBranchToRoot(this.package.path);

				await this.package.build({}, config);
			} else {
				await this.package.build({}, {});
			}

			this.log(
				applyStyle('Built %s in %s', 'success'),
				this.package.getName(),
				formatMs(Date.now() - start),
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.log.error(error.message);
			}

			this.log(applyStyle('Failed to build %s', 'failure'), this.package.getName());
		} finally {
			this.rebuilding = false;
		}
	}
}
