import fs from 'fs-extra';
import path from 'path';
import execa from 'execa';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import Artifact from './Artifact';
import { APIExtractorStructure } from './types';

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
    const pkgPath = this.package.path;

    // Compile the current project to a DTS folder
    await execa(
      'tsc',
      [
        '--declaration',
        '--declarationMap',
        '--declarationDir',
        'dts-build',
        '--emitDeclarationOnly',
      ],
      {
        cwd: pkgPath.path(),
        preferLocal: true,
      },
    );

    // Combine all DTS files into a single file for each input
    await Promise.all(
      Object.entries(this.package.config.inputs).map(([outputName, inputPath]) =>
        this.generateDeclaration(outputName),
      ),
    );

    // Remove old DTS build folder
    await fs.remove(pkgPath.append('dts-build').path());
  }

  pack(): void {
    this.package.contents.types = './dts/index.d.ts';
  }

  getLabel(): string {
    return 'types';
  }

  getBuilds(): string[] {
    return ['dts'];
  }

  protected async generateDeclaration(outputName: string) {
    const configPath = this.package.path.append(`api-extractor-${outputName}.json`).path();
    const config: APIExtractorStructure = {
      ...extractorConfig,
      projectFolder: this.package.path.path(),
      mainEntryPointFilePath: `<projectFolder>/dts-build/${outputName}.d.ts`,
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
        `Generated ${outputName} types completed with ${result.errorCount} errors and ${result.warningCount} warnings!`,
      );
    }

    // Remove the config file
    await fs.unlink(configPath);
  }
}
