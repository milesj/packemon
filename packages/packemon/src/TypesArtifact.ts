import { VirtualPath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { removeSourcePath } from './helpers/removeSourcePath';
import {
	BuildOptions,
	DeclarationType,
	PackageExports,
	TSConfigStructure,
	TypesBuild,
} from './types';

export class TypesArtifact extends Artifact<TypesBuild> {
	declarationType: DeclarationType = 'standard';

	protected debug!: Debugger;

	override startup() {
		this.debug = createDebugger(['packemon', 'types', this.package.getSlug(), this.getLabel()]);
	}

	async build(options: BuildOptions): Promise<void> {
		this.debug('Building "%s" types artifact with TypeScript', this.declarationType);

		// Compile the current projects declarations
		this.debug('Generating declarations at the root using `tsc`');

		await this.package.project.generateDeclarations(
			this.declarationType,
			this.package.path,
			options.declarationConfig,
		);
	}

	findEntryPoint(outputName: string): string {
		const output = this.builds.find((build) => build.outputName === outputName);

		if (!output) {
			return '';
		}

		// When not generating individual API declarations, we need to mirror the source structure
		const entry =
			this.declarationType === 'standard' ? removeSourcePath(output.inputFile) : outputName;

		return `./${new VirtualPath('dts', entry)}.d.ts`;
	}

	getLabel(): string {
		return 'dts';
	}

	getBuildTargets(): string[] {
		return ['dts'];
	}

	getPackageExports(): PackageExports {
		const exportMap: PackageExports = {};

		if (this.api === 'private' || this.declarationType === 'api') {
			this.builds.forEach(({ outputName }) => {
				exportMap[outputName === 'index' ? '.' : `./${outputName}`] = {
					types: this.findEntryPoint(outputName),
				};
			});
		} else {
			exportMap['./*'] = { types: './dts/*.d.ts' };
			exportMap['.'] = { types: './dts/index.d.ts' };
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
