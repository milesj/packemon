import fs from 'fs-extra';
import execa from 'execa';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import Artifact from './Artifact';

export default class TypesArtifact extends Artifact {
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

    // Combine all DTS files into a single file
    const result = Extractor.invoke(
      ExtractorConfig.loadFileAndPrepare(pkgPath.append('api-extractor.json').path()),
      {
        localBuild: process.env.NODE_ENV !== 'production',
        showVerboseMessages: false,
      },
    );

    if (!result.succeeded) {
      console.error(
        `Generated types completed with ${result.errorCount} errors and ${result.warningCount} warnings!`,
      );
    }

    // Remove old build
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
}
