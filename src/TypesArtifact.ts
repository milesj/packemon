import fs from 'fs-extra';
import path from 'path';
import { Path } from '@boost/common';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import Artifact from './Artifact';
import { APIExtractorStructure, TSConfigStructure } from './types';

// eslint-disable-next-line
const extractorConfig = require(path.join(__dirname, '../api-extractor.json')) as {
  projectFolder: string;
  mainEntryPointFilePath: string;
  dtsRollup: {
    untrimmedFilePath: string;
  };
};

export default class TypesArtifact extends Artifact {
  async build(): Promise<void> {
    const tsConfig = this.package.tsconfigJson;

    // Compile the current projects declarations
    await this.package.project.generateDeclarations();

    // Combine all DTS files into a single file for each input
    await Promise.all(
      Object.entries(this.package.config.inputs).map(([outputName, inputPath]) =>
        this.generateDeclaration(outputName, inputPath, tsConfig),
      ),
    );
  }

  postBuild(): void {
    this.package.packageJson.types = './dts/index.d.ts';
  }

  getLabel(): string {
    return 'types';
  }

  getTargets(): string[] {
    return ['dts'];
  }

  protected async generateDeclaration(
    outputName: string,
    inputPath: string,
    tsConfig?: TSConfigStructure,
  ): Promise<unknown> {
    // Resolved compiler options use absolute paths, so we should match
    const declDir = tsConfig
      ? new Path(tsConfig.options.declarationDir || tsConfig.options.outDir!)
      : this.package.path.append('lib');
    const declEntry = declDir.append(inputPath.replace('src/', '').replace('.ts', '.d.ts'));

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

    // Remove the config file
    await fs.unlink(configPath);

    return result;
  }
}
