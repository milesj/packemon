import { rollup, RollupCache } from 'rollup';
import { toArray, VirtualPath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { removeSourcePath } from './helpers/removeSourcePath';
import { getRollupConfig } from './rollup/config';
import {
	BuildOptions,
	BuildResultFiles,
	CodeBuild,
	ConfigFile,
	Format,
	InputMap,
	PackageExportPaths,
	PackageExports,
	Platform,
	Support,
} from './types';

export class CodeArtifact extends Artifact<CodeBuild> {
	cache?: RollupCache;

	// Config object in which inputs are grouped in
	configGroup: number = 0;

	// List of custom Rollup externals
	externals: string[] = [];

	// Mapping of output names to input paths
	inputs: InputMap = {};

	// Namespace for UMD bundles
	namespace: string = '';

	// Platform code will run on
	platform: Platform = 'node';

	// Are multiple builds writing to the lib folder
	sharedLib: boolean = false;

	// Target version code will run in
	support: Support = 'stable';

	protected debug!: Debugger;

	override startup() {
		this.debug = createDebugger(['packemon', 'code', this.package.getSlug(), this.getLabel()]);
	}

	override async cleanup(): Promise<void> {
		this.debug('Cleaning code artifacts');

		// Visualizer stats
		await this.removeFiles([this.package.project.root.append(this.getStatsFileName())]);
	}

	async build(options: BuildOptions, packemonConfig: ConfigFile): Promise<void> {
		this.debug('Building code artifacts with Rollup');

		const features = this.package.getFeatureFlags();
		const { output = [], ...input } = getRollupConfig(this, features, packemonConfig);
		const bundle = await rollup({
			...input,
			onwarn: /* istanbul ignore next */ ({ id, loc = {}, message }) => {
				this.logWithSource(message, 'warn', {
					id: id && id !== loc.file ? id : undefined,
					output: this.package.getSlug(),
					sourceColumn: loc.column,
					sourceFile: loc.file,
					sourceLine: loc.line,
				});
			},
		});

		if (bundle.cache) {
			this.cache = bundle.cache;
		}

		const files: BuildResultFiles[] = [];

		await Promise.all(
			toArray(output).map(async (out, index) => {
				const { originalFormat = 'lib', ...outOptions } = out;

				this.debug(' - Writing `%s` output', originalFormat);

				// While testing we want to avoid writing files,
				// so use generate() instead of write():
				// https://github.com/rollup/rollup/issues/4082
				const result =
					process.env.NODE_ENV === 'test' && !process.env.PACKEMON_TEST_WRITE
						? await bundle.generate(outOptions)
						: await bundle.write(outOptions);

				// Update build results and stats
				const bundledCode = result.output.reduce((code, chunk) => {
					if (chunk.type === 'chunk') {
						files.push({
							code: chunk.code,
							file: `${originalFormat}/${chunk.fileName}`,
						});

						return code + chunk.code;
					}

					return code;
				}, '');

				this.builds[index].stats = {
					size: Buffer.byteLength(bundledCode),
				};

				return result;
			}),
		);

		this.buildResult.files = files;
	}

	findEntryPoint(formats: Format[], outputName: string): string | undefined {
		for (const format of formats) {
			if (this.builds.some((build) => build.format === format)) {
				return this.getBuildOutput(format, outputName).path;
			}
		}

		return undefined;
	}

	getBuildOutput(format: Format, outputName: string = '') {
		let name = outputName;

		// When using a public API, we do not create output files based on the input map.
		// Instead files mirror the source file structure, so we need to take that into account!
		if (this.api === 'public' && this.inputs[outputName]) {
			name = removeSourcePath(this.inputs[outputName]);
		}

		const ext = format === 'cjs' || format === 'mjs' ? format : 'js';
		const extGroup = format === 'cjs' ? 'cjs,mjs,map' : `${ext},map`;
		const folder = format === 'lib' && this.sharedLib ? `lib/${this.platform}` : format;
		const file = `${name}.${ext}`;

		return {
			ext,
			extGroup,
			file,
			folder,
			path: `./${new VirtualPath(folder, file)}`,
		};
	}

	getBuildTargets(): string[] {
		return this.builds.map((build) => build.format);
	}

	getInputPaths(): InputMap {
		// Return absolute paths so that Rollup paths/externals resolve correctly
		return Object.fromEntries(
			Object.entries(this.inputs).map(([outputName, inputFile]) => [
				outputName,
				this.package.path.append(inputFile).path(),
			]),
		);
	}

	getLabel(): string {
		return `${this.platform}:${this.support}:${this.getBuildTargets().join(',')}`;
	}

	getPackageExports(): PackageExports {
		const exportMap: PackageExports = {};

		if (this.api === 'private' || this.bundle) {
			Object.keys(this.inputs).forEach((outputName) => {
				this.mapPackageExportsFromBuilds(outputName, exportMap);
			});
		} else {
			// Use subpath export patterns when not bundling
			// https://nodejs.org/api/packages.html#subpath-patterns
			this.mapPackageExportsFromBuilds('*', exportMap);
			this.mapPackageExportsFromBuilds('index', exportMap);
		}

		return exportMap;
	}

	getStatsFileName(): string {
		return `stats-${this.getStatsTitle().replace(/\//gu, '-')}.html`;
	}

	getStatsTitle(): string {
		return `${this.package.getName()}/${this.platform}/${this.support}`;
	}

	override toString() {
		return `code (${this.getLabel()})`;
	}

	// eslint-disable-next-line complexity
	protected mapPackageExportsFromBuilds(outputName: string, exportMap: PackageExports) {
		const defaultEntry = this.findEntryPoint(['lib'], outputName);
		let paths: PackageExportPaths = {};

		switch (this.platform) {
			case 'browser': {
				const moduleEntry = this.findEntryPoint(['esm'], outputName);

				paths = {
					module: moduleEntry, // Bundlers
					import: moduleEntry,
					default: this.findEntryPoint(['umd', 'lib'], outputName), // Node.js tooling
				};
				break;
			}

			case 'node': {
				paths = {
					import: this.findEntryPoint(['mjs'], outputName),
					require: this.findEntryPoint(['cjs'], outputName),
				};

				// Automatically apply the mjs wrapper for cjs
				if (!paths.import && outputName !== '*' && paths.require) {
					paths.import = (paths.require as string).replace('.cjs', '-wrapper.mjs');
				}
				break;
			}

			case 'native':
				paths.default = defaultEntry;
				break;

			default:
				break;
		}

		// Remove undefined values
		for (const key in paths) {
			if (paths[key as keyof typeof paths] === undefined) {
				delete paths[key as keyof typeof paths];
			}
		}

		const pathsCount = Object.keys(paths).length;
		const pathsMap = {
			[this.platform === 'native' ? 'react-native' : this.platform]:
				// eslint-disable-next-line no-nested-ternary
				pathsCount === 0 && defaultEntry
					? defaultEntry
					: pathsCount === 1 && paths.default
					? paths.default
					: paths,
		};

		// Provide fallbacks if condition above is not
		if (defaultEntry) {
			pathsMap.default = defaultEntry;
		}

		// eslint-disable-next-line no-param-reassign
		exportMap[outputName === 'index' ? '.' : `./${outputName}`] = pathsMap;
	}
}
