import { applyStyle, Arg, Config } from '@boost/cli';
import { Bind, formatMs } from '@boost/common';
import chokidar from 'chokidar';
import Command from './Base';
import Package from '../Package';

export interface WatchOptions {
  debounce: number;
  poll: boolean;
}

@Config('watch', 'Watch local files for changes and rebuild')
export class WatchCommand extends Command<WatchOptions> {
  @Arg.Number('Number of milliseconds to wait after a change before triggering a rebuild')
  debounce: number = 150;

  @Arg.Flag('Poll for file changes instead of using file system events')
  poll: boolean = false;

  protected packagesToRebuild = new Set<Package>();

  protected rebuilding: boolean = false;

  protected rebuildTimer?: NodeJS.Timeout;

  async run() {
    const { packemon } = this;

    packemon.debug('Starting `watch` process');

    // Generate all our build artifacts
    await packemon.loadConfiguredPackages();

    packemon.generateArtifacts();

    // Instantiate the watcher for each package source
    const watchPaths = packemon.packages.map((pkg) => pkg.path.append('src/**/*').path());

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

  @Bind()
  enqueueRebuild(event: string, path: string) {
    if (event !== 'add' && event !== 'change' && event !== 'unlink') {
      return;
    }

    this.log(applyStyle(' - %s', 'muted'), path.replace(`${this.packemon.root.path()}/`, ''));

    const changedPkg = this.packemon.packages.find((pkg) => path.startsWith(pkg.path.path()));

    if (changedPkg) {
      this.packagesToRebuild.add(changedPkg);
      this.triggerRebuilds();
    }
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

    const pkgs = Array.from(this.packagesToRebuild);
    const pkgNames = pkgs.map((pkg) => pkg.getName());

    if (pkgs.length === 0) {
      return;
    }

    this.packagesToRebuild.clear();
    this.rebuilding = true;

    try {
      const start = Date.now();

      await Promise.all(pkgs.map((pkg) => pkg.build({})));

      this.log(
        applyStyle('Built %s in %s', 'success'),
        pkgNames.join(', '),
        formatMs(Date.now() - start),
      );
    } catch (error) {
      this.log.error(error.message);

      this.log(applyStyle('Failed to build %s', 'failure'), pkgNames.join(', '));
    } finally {
      this.rebuilding = false;
    }
  }
}
