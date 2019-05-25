import Asset from './Asset';
import AssetRegistry from './AssetRegistry';

export default class SourceGraph {
  assetRegistry: AssetRegistry;

  inputFilePath: string;

  rootAsset: Asset;

  constructor(inputFilePath: string, assetRegistry: AssetRegistry) {
    this.inputFilePath = inputFilePath;
    this.assetRegistry = assetRegistry;
    this.rootAsset = assetRegistry.factory(inputFilePath);
  }

  async resolveGraph() {}
}
