import path from 'path';
import { Contract } from '@boost/common';
import { string } from 'optimal';
import SourceGraph from './SourceGraph';
import AssetRegistry from './AssetRegistry';

export interface BundlerOptions {
  cwd?: string;
}

export interface BundleConfig {
  assetTypes?: string[];
  destination: string;
  sources: { [key: string]: string };
}

export default class Bundler extends Contract<BundlerOptions> {
  sources: SourceGraph[] = [];

  blueprint() {
    return {
      cwd: string(process.cwd()),
    };
  }

  async bundle(config: BundleConfig) {
    const { cwd } = this.options;

    // Register all our possible assets
    const assetRegistry = new AssetRegistry();

    await assetRegistry.registerFromPackemonSource();
    await assetRegistry.registerFromNodeModules(cwd);

    if (config.assetTypes) {
      assetRegistry.registerFromLocalConfig(cwd, config.assetTypes);
    }
  }

  private async bundleSource(srcPath: string, dstPath: string) {
    const sourcePath = path.join(this.options.cwd, srcPath);
    const source = new SourceGraph(sourcePath);
  }
}
