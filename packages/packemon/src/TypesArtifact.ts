import path from 'path';
import { VirtualPath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { removeSourcePath } from './helpers/removeSourcePath';
import { BuildOptions, PackageExports, TSConfigStructure, TypesBuild } from './types';

export class TypesArtifact extends Artifact<TypesBuild> {
	protected debug!: Debugger;

	override startup() {
		this.debug = createDebugger(['packemon', 'types', this.package.getSlug(), this.getLabel()]);
	}

	async build(options: BuildOptions): Promise<void> {
		this.debug('Building types artifact with TypeScript');

		await this.package.project.generateDeclarations(this.package.path, options.declarationConfig);
	}

	findEntryPoint(outputName: string): string {
		const output = this.builds.find((build) => build.outputName === outputName);

		if (!output) {
			return '';
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

	getLabel(): string {
		return 'dts';
	}

	getBuildTargets(): string[] {
		return ['dts'];
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

	override toString() {
		return `types (${this.getLabel()})`;
	}

	// This method only exists so that we can mock in tests.
	// istanbul ignore next
	protected loadTsconfigJson(): TSConfigStructure | undefined {
		return this.package.tsconfigJson;
	}
}
