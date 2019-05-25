import path from 'path';
import glob from 'fast-glob';
// TODO add to boost
import { Constructor } from 'optimal/lib/InstanceBuilder';
import Asset from './Asset';
import getExtFromPath from './utils/getExtFromPath';

export default class AssetRegistry {
  registry: Map<string, Constructor<Asset>> = new Map();

  /**
   * Find and instantiate an asset class for the defined file path extension.
   * If no asset has been registered for the extension, throw an error.
   */
  factory<T = Asset>(filePath: string): T {
    const ext = getExtFromPath(filePath);
    const contract = this.registry.get(ext);

    if (!contract) {
      throw new Error(`No asset type found for extension "${ext}". Has it been registered?`);
    }

    return new (contract as any)(filePath);
  }

  /**
   * Register an `Asset` contract with an explicit extension.
   */
  register(ext: string, contract: Constructor<Asset>): this {
    this.registry.set(ext.startsWith('.') ? ext.slice(1) : ext, contract);

    return this;
  }

  /**
   * Register an asset at the defined file path or node module.
   */
  registerFromFilePath(filePath: string): this {
    const contract = require(filePath);
    const exts: string[] = contract.EXTENSIONS;

    if (!contract || !Array.isArray(exts) || exts.length === 0) {
      throw new Error(
        `Failed to load asset from "${filePath}". Must export a class declaration that defines a static EXTENSIONS property.`,
      );
    }

    exts.forEach(ext => {
      this.register(ext, contract);
    });

    return this;
  }

  /**
   * Register all assets found under the `assetTypes` configuration.
   */
  registerFromLocalConfig(cwd: string, filePaths: string[]): this {
    filePaths.forEach(filePath => {
      this.registerFromFilePath(path.join(cwd, filePath));
    });

    return this;
  }

  /**
   * Register all assets found within node module packages.
   */
  async registerFromNodeModules(cwd: string): Promise<void> {
    const modulePaths = await glob<string>(
      [
        path.join(cwd, 'node_modules/@packemon/asset-*'),
        path.join(cwd, 'node_modules/packemon-asset-*'),
      ],
      {
        absolute: true,
        onlyDirectories: true,
      },
    );

    modulePaths.forEach(modulePath => {
      let moduleName = path.basename(modulePath);

      if (modulePath.includes('@packemon')) {
        moduleName = '@packemon/' + moduleName;
      }

      this.registerFromFilePath(moduleName);
    });
  }

  /**
   * Register all assets found within the Packemon repository source
   * (found in the relative assets folder).
   */
  async registerFromPackemonSource(): Promise<void> {
    const filePaths = await glob<string>(path.join(__dirname, './assets/*.{ts,js}'), {
      absolute: true,
      onlyFiles: true,
    });

    filePaths.forEach(filePath => {
      this.registerFromFilePath(filePath);
    });
  }
}
