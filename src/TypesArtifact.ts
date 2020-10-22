import fs from 'fs-extra';
import path from 'path';
import glob from 'fast-glob';
import { Path } from '@boost/common';
import { createDebugger } from '@boost/debug';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import Artifact from './Artifact';
import { APIExtractorStructure } from './types';

const debug = createDebugger('packemon:types');

// eslint-disable-next-line
const extractorConfig = require(path.join(__dirname, '../api-extractor.json')) as {
  projectFolder: string;
  mainEntryPointFilePath: string;
  dtsRollup: {
    untrimmedFilePath: string;
  };
};

export default class TypesArtifact extends Artifact {
  private apiExtractorConfigPaths: string[] = [];

  async cleanup(): Promise<void> {
    debug('Cleaning up temporary API extractor config files');

    // Absolute paths to each temporary config file
    await Promise.all(this.apiExtractorConfigPaths.map((cfgPath) => fs.remove(cfgPath)));
  }

  async build(): Promise<void> {
    debug('Building types artifact with TypeScript');

    const tsConfig = this.package.tsconfigJson;

    // Resolved compiler options use absolute paths, so we should match
    const declBuildPath = tsConfig
      ? new Path(tsConfig.options.declarationDir || tsConfig.options.outDir!)
      : this.package.path.append('lib');

    // Compile the current projects declarations
    debug('Generating declarations at the root using `tsc`');

    await this.package.project.generateDeclarations();

    // Combine all DTS files into a single file for each input
    debug('Combining declarations into a single API declaration file');

    const promises: Promise<unknown>[] = [];

    this.package.configs.forEach((config) => {
      Object.entries(config.inputs).forEach(([outputName, inputPath]) => {
        promises.push(this.generateDeclaration(outputName, inputPath, declBuildPath));
      });
    });

    await Promise.all(promises);

    // Remove the TS output directory to reduce package size.
    // We do this in the background to speed up the CLI process!
    if (this.package.project.isWorkspacesEnabled()) {
      debug('Removing old and unnecessary declarations in the background');

      void this.removeDeclarationBuild(declBuildPath);
    }
  }

  postBuild(): void {
    this.package.packageJson.types = './dts/index.d.ts';
  }

  getLabel(): string {
    return 'types';
  }

  getBuildTargets(): string[] {
    return ['dts'];
  }

  toString() {
    return `types (dts)`;
  }

  protected async generateDeclaration(
    outputName: string,
    inputPath: string,
    declBuildPath: Path,
  ): Promise<unknown> {
    const declEntry = declBuildPath.append(inputPath.replace('src/', '').replace('.ts', '.d.ts'));

    if (!declEntry.exists()) {
      console.warn(
        `Unable to generate declaration for "${outputName}". Entry point "${declEntry}" does not exist.`,
      );

      return Promise.resolve();
    }

    // Create a fake config file
    const configPath = this.package.path.append(`api-extractor-${outputName}.json`).path();
    const config: APIExtractorStructure = {
      ...extractorConfig,
      projectFolder: this.package.path.path(),
      mainEntryPointFilePath: declEntry.path(),
      dtsRollup: {
        ...extractorConfig.dtsRollup,
        untrimmedFilePath: `<projectFolder>/dts/${outputName}.d.ts`,
      },
    };

    // Create the config file within the package
    await fs.writeJson(configPath, config);

    // Extract all DTS into a single file
    const result = Extractor.invoke(ExtractorConfig.loadFileAndPrepare(configPath), {
      localBuild: process.env.NODE_ENV !== 'production',
      showVerboseMessages: false,
    });

    if (!result.succeeded) {
      console.error(
        `Generated "${outputName}" types completed with ${result.errorCount} errors and ${result.warningCount} warnings!`,
      );
    }

    // Enqueue to remove the config file
    this.apiExtractorConfigPaths.push(configPath);

    return result;
  }

  /**
   * This method is unfortunate but necessary if TypeScript is using project references.
   * When using references, TS uses the `types` (or `typings`) field to determine types
   * across packages. But since we set that field to "dts/index.d.ts" for distributing
   * only the types necessary, it breaks the `tsc --build` unless the `outDir` is "dts".
   *
   * But when this happens, we have all the generated `*.d.ts` and `*.js` files in the "dts"
   * folder, which we do not want to distribute. So we need to manually delete all of them
   * except for the output files we created above.
   *
   * Not sure of a workaround or better solution :(
   */
  protected async removeDeclarationBuild(declBuildPath: Path) {
    const outputs = new Set<string>();

    // Generate all output combinations
    this.package.configs.forEach((config) => {
      Object.keys(config.inputs).forEach((outputName) => {
        outputs.add(`${outputName}.d.ts`);
      });
    });

    // Remove all build files in the root except for the output files we created
    const files = await glob(['*.js', '*.d.ts', '*.d.ts.map'], {
      cwd: declBuildPath.path(),
      onlyFiles: true,
    });

    await Promise.all(
      files
        .filter((file) => !outputs.has(file))
        .map((file) => fs.unlink(declBuildPath.append(file).path())),
    );

    // Remove all build folders recursively since our output files are always in the root
    const folders = await glob(['*'], {
      cwd: declBuildPath.path(),
      onlyDirectories: true,
    });

    await Promise.all(folders.map((folder) => fs.remove(declBuildPath.append(folder).path())));
  }
}
