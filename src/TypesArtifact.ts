import fs from 'fs-extra';
import path from 'path';
import execa from 'execa';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import Artifact from './Artifact';
import { APIExtractorStructure } from './types';

export default class TypesArtifact extends Artifact {
  extractorConfig!: {
    projectFolder: string;
    mainEntryPointFilePath: string;
    dtsRollup: {
      untrimmedFilePath: string;
    };
  };

  async boot(): Promise<void> {
    this.extractorConfig = (await fs.readJson(
      path.join(__dirname, '../api-extractor.json'),
    )) as APIExtractorStructure;
  }

  async build(): Promise<void> {
    this.result = {
      stats: {},
      time: 0,
    };

    const pkgPath = this.package.path;
    const start = Date.now();

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

    this.result.time = Date.now() - start;
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
      ...this.extractorConfig,
      projectFolder: this.package.path.path(),
      mainEntryPointFilePath: `<projectFolder>/dts-build/${outputName}.d.ts`,
      dtsRollup: {
        ...this.extractorConfig.dtsRollup,
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
