import { applyStyle, Arg, Command, Config, GlobalOptions } from '@boost/cli';
import { formatMs } from '@boost/common';
import chokidar from 'chokidar';
import Package from '../Package';
import Packemon from '../Packemon';

@Config('watch', 'Watch local files for changes and rebuild')
export class WatchCommand extends Command<GlobalOptions> {
  @Arg.Number('Number of milliseconds to wait after a change before triggering a rebuild')
  interval: number = 350;

  protected packemon!: Packemon;

  protected packagesToRebuild = new Set<Package>();

  protected rebuilding: boolean = false;

  async run() {
    const packemon = new Packemon();

    this.packemon = packemon;
    packemon.debug('Starting `watch` process');

    // Generate all our build artifacts
    await packemon.findPackages();
    await packemon.generateArtifacts();

    // Instantiate the watcher for each package source
    const watchPaths = packemon.packages.map((pkg) => pkg.path.append('src/**/*').path());

    packemon.debug('Initializing chokidar watcher for paths:');
    packemon.debug(watchPaths.map((path) => ` - ${path}`).join('\n'));

    const watcher = chokidar.watch(watchPaths, {
      ignored: /(^|[/\\])\../u, // dotfiles
      ignoreInitial: true,
      persistent: true,
    });

    // Rebuild when files change
    watcher.on('all', this.enqueueRebuild);

    setInterval(() => {
      void this.triggerPackageRebuilds();
    }, this.interval);

    this.log('Watching for changes...');
  }

  enqueueRebuild = (event: string, path: string) => {
    if (event !== 'add' && event !== 'change' && event !== 'unlink') {
      return;
    }

    this.log(applyStyle(' - %s', 'muted'), path.replace(`${this.packemon.root.path()}/`, ''));

    const changedPkg = this.packemon.packages.find((pkg) => path.startsWith(pkg.path.path()));

    if (changedPkg) {
      this.packagesToRebuild.add(changedPkg);
    }
  };

  async triggerPackageRebuilds() {
    if (this.rebuilding) {
      return;
    }

    const pkgs = Array.from(this.packagesToRebuild);
    const pkgNames = pkgs.map((pkg) => pkg.getName());

    if (pkgs.length === 0) {
      return;
    }

    this.packagesToRebuild.clear();
    this.rebuilding = true;

    const start = Date.now();

    await Promise.all(
      pkgs.map((pkg) =>
        pkg.build({
          addEngines: false,
          addExports: false,
          analyzeBundle: 'none',
          concurrency: 1,
          generateDeclaration: 'none',
          skipPrivate: false,
          timeout: 0,
        }),
      ),
    );

    this.rebuilding = false;
    this.log(
      applyStyle('Built %s in %s', 'success'),
      pkgNames.join(', '),
      formatMs(Date.now() - start),
    );
  }
}
