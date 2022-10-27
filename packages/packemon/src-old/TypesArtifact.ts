import path from 'path';
import execa from 'execa';
import { VirtualPath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { removeSourcePath } from './helpers/removeSourcePath';
import { BuildOptions, PackageExports, TSConfigStructure, TypesBuild } from './types';

export class TypesArtifact extends Artifact<TypesBuild> {
	findEntryPoint(outputName: string): string | undefined {
		const output = this.builds.find((build) => build.outputName === outputName);

		if (!output) {
			return undefined;
		}

		return `./${new VirtualPath(
			'dts',
			removeSourcePath(output.inputFile),
		)}.${this.getDeclExtFromInput(output.inputFile)}`;
	}

	getDeclExt(): string {
		const baseInputExt = path.extname(this.builds[0].inputFile);
		const isAllSameExt = this.builds.every((build) => build.inputFile.endsWith(baseInputExt));

		if (!isAllSameExt) {
			throw new Error(
				'All inputs must share the same extension. Cannot determine a TypeScript declaration format.',
			);
		}

		return this.getDeclExtFromInput(baseInputExt);
	}

	getDeclExtFromInput(inputFile: string): string {
		if (inputFile.endsWith('.cts')) {
			return 'd.cts';
		}

		if (inputFile.endsWith('.mts')) {
			return 'd.mts';
		}

		return 'd.ts';
	}

	getPackageExports(): PackageExports {
		const exportMap: PackageExports = {};

		if (this.api === 'private' || this.bundle) {
			this.builds.forEach(({ outputName }) => {
				exportMap[outputName === 'index' ? '.' : `./${outputName}`] = {
					types: this.findEntryPoint(outputName),
				};
			});
		} else {
			const ext = this.getDeclExt();

			exportMap['./*'] = { types: `./dts/*.${ext}` };
			exportMap['.'] = { types: `./dts/index.${ext}` };
		}

		return exportMap;
	}
}
