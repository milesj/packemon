import glob from 'fast-glob';
import fs from 'fs-extra';
import { Path, VirtualPath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import { Artifact } from './Artifact';
import { removeSourcePath } from './helpers/removeSourcePath';
import {
	APIExtractorStructure,
	BuildOptions,
	DeclarationType,
	PackageExports,
	TSConfigStructure,
	TypesBuild,
} from './types';
import { apiExtractorConfig } from './typescript/apiExtractorConfig';

export class TypesArtifact extends Artifact<TypesBuild> {
	declarationType: DeclarationType = 'standard';

	protected debug!: Debugger;

	override startup() {
		this.debug = createDebugger(['packemon', 'types', this.package.getSlug(), this.getLabel()]);
	}

	override async cleanup(): Promise<void> {
		// API extractor config files
		await this.removeFiles(
			this.builds.map(({ outputName }) => this.getApiExtractorConfigPath(outputName)),
		);
	}

	async build(options: BuildOptions): Promise<void> {
		this.debug('Building "%s" types artifact with TypeScript', this.declarationType);

		const tsConfig = this.loadTsconfigJson();

		// Compile the current projects declarations
		this.debug('Generating declarations at the root using `tsc`');

		await this.package.project.generateDeclarations(
			this.declarationType,
			this.package.path,
			options.declarationConfig,
		);

		// Combine all DTS files into a single file for each input
		if (this.declarationType === 'api') {
			this.debug('Combining declarations into a single API declaration file');

			// Resolved compiler options use absolute paths, so we should match
			let dtsBuildPath = this.package.path.append('dts');

			// Workspaces use the tsconfig setting, while non-workspaces is hard-coded to "dts"
			if (tsConfig && this.package.project.isWorkspacesEnabled()) {
				dtsBuildPath = new Path(
					tsConfig.options.declarationDir ?? tsConfig.options.outDir ?? dtsBuildPath,
				);
			}

			await Promise.all(
				this.builds.map(({ inputFile, outputName }) =>
					this.generateApiDeclaration(outputName, inputFile, dtsBuildPath),
				),
			);

			// Remove the TS output directory to reduce package size.
			// We do this in the background to speed up the CLI process!
			this.debug('Removing old and unnecessary declarations in the background');

			void this.removeDeclarationBuild(dtsBuildPath);
		}
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

		if (this.bundle) {
			this.builds.forEach(({ outputName }) => {
				exportMap[`./${outputName}`] = {
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

	protected async generateApiDeclaration(
		outputName: string,
		inputFile: string,
		dtsBuildPath: Path,
	): Promise<unknown> {
		const dtsEntryPoint = dtsBuildPath.append(`${removeSourcePath(inputFile)}.d.ts`);

		if (!dtsEntryPoint.exists()) {
			console.warn(
				`Unable to generate declaration for "${outputName}". Declaration entry point "${dtsEntryPoint}" does not exist.`,
			);

			return Promise.resolve();
		}

		// Create a fake config file
		const configPath = this.getApiExtractorConfigPath(outputName).path();
		const config: APIExtractorStructure = {
			...apiExtractorConfig,
			projectFolder: VirtualPath.create(this.package.path).path(),
			mainEntryPointFilePath: VirtualPath.create(dtsEntryPoint).path(),
			dtsRollup: {
				...apiExtractorConfig.dtsRollup,
				untrimmedFilePath: `<projectFolder>/dts/${outputName}.d.ts`,
			},
		};

		// Create the config file within the package
		await fs.writeJson(configPath, config);

		// Extract all DTS into a single file
		const result = Extractor.invoke(ExtractorConfig.loadFileAndPrepare(configPath), {
			localBuild: __DEV__,
			messageCallback: /* istanbul ignore next */ (warn) => {
				// eslint-disable-next-line no-param-reassign
				warn.handled = true;

				if (
					warn.messageId === 'ae-missing-release-tag' ||
					warn.messageId === 'console-preamble' ||
					warn.logLevel === 'verbose'
				) {
					return;
				}

				let level = 'info';

				if (warn.logLevel === 'error') {
					level = 'error';
				} else if (warn.logLevel === 'warning') {
					level = 'warn';
				}

				this.logWithSource(warn.text, level as 'info', {
					id: warn.messageId,
					output: `${this.package.getSlug()}:${outputName}`,
					sourceColumn: warn.sourceFileColumn,
					sourceFile: warn.sourceFilePath,
					sourceLine: warn.sourceFileLine,
				});
			},
		});

		if (!result.succeeded) {
			console.error(
				`Generated "${outputName}" types completed with ${result.errorCount} errors and ${result.warningCount} warnings!`,
			);
		}

		return result;
	}

	protected getApiExtractorConfigPath(outputName: string): Path {
		return this.package.path.append(`api-extractor-${outputName}.json`);
	}

	// This method only exists so that we can mock in tests.
	// istanbul ignore next
	protected loadTsconfigJson(): TSConfigStructure | undefined {
		return this.package.tsconfigJson;
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
	protected async removeDeclarationBuild(dtsBuildPath: Path) {
		const outputs = new Set<string>(this.builds.map(({ outputName }) => `${outputName}.d.ts`));

		// Remove all non-output files
		const files = await glob('*', {
			cwd: dtsBuildPath.path(),
			onlyFiles: true,
		});

		// Remove all folders
		const folders = await glob('*', {
			cwd: dtsBuildPath.path(),
			onlyDirectories: true,
		});

		await Promise.all(
			[...files, ...folders]
				.filter((file) => !outputs.has(file))
				.map((file) => fs.remove(dtsBuildPath.append(file).path())),
		);
	}
}
