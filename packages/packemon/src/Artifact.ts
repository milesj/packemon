import execa from 'execa';
import glob from 'fast-glob';
import fs from 'fs-extra';
import { rollup } from 'rollup';
import { applyStyle } from '@boost/cli';
import { isObject, Path, toArray, VirtualPath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { removeSourcePath } from './helpers/removeSourcePath';
import type { Package } from './Package';
import { getRollupConfig } from './rollup/config';
import type {
	ApiType,
	ArtifactState,
	Build,
	BuildOptions,
	BuildResult,
	BuildResultFiles,
	ConfigFile,
	FeatureFlags,
	Format,
	InputMap,
	PackageExportPaths,
	PackageExports,
	PackemonPackageFeatures,
	Platform,
	Support,
} from './types';

export class Artifact {
	api: ApiType = 'private';

	bundle: boolean = true;

	// List of artifacts to build
	builds: Build[] = [];

	// Stats on the built artifacts
	buildResult: BuildResult = { files: [], time: 0 };

	// Config object in which inputs are grouped in
	configGroup: number = 0;

	// List of custom Rollup externals
	externals: string[] = [];

	// Features unique to this artifact
	features: PackemonPackageFeatures = {};

	// Mapping of output names to input paths
	inputs: InputMap = {};

	// Namespace for UMD bundles
	namespace: string = '';

	// Platform code will run on
	platform: Platform = 'node';

	// The package being built
	package: Package;

	// Are multiple builds writing to the lib folder
	sharedLib: boolean = false;

	// Target version code will run in
	support: Support = 'stable';

	// Current state
	state: ArtifactState = 'pending';

	protected debug!: Debugger;

	constructor(pkg: Package, builds: Build[]) {
		this.package = pkg;
		this.builds = builds;
		this.debug = createDebugger(['packemon', 'artifact', pkg.getSlug(), this.getLabel()]);
	}

	/**
	 * Build code and types in parallel.
	 */
	async build(
		options: BuildOptions,
		features: FeatureFlags,
		packemonConfig: ConfigFile,
	): Promise<void> {
		await Promise.all([this.buildCode(features, packemonConfig), this.buildTypes(features)]);
	}

	/**
	 * Build code artifacts using Rollup. We'll spin up a Rollup instance for each output,
	 * as Rollup will then generate all the necessary formats. For example:
	 * index -> cjs, lib.
	 */
	async buildCode(features: FeatureFlags, packemonConfig: ConfigFile): Promise<void> {
		this.debug('Building code artifacts with Rollup');

		const { output = [], ...input } = await getRollupConfig(this, features, packemonConfig);
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

	/**
	 * Build type artifacts using TypeScript. We'll need to spin up an individual process
	 * for each format, as they may require different declaration outputs or compiler options.
	 */
	async buildTypes(features: FeatureFlags): Promise<void> {
		if (!features.typescript) {
			return;
		}

		this.debug('Building types artifacts with TypeScript');

		await Promise.all(
			this.builds.map((build) => {
				if (!build.declaration) {
					return Promise.resolve();
				}

				const args: string[] = [];

				if (features.typescriptComposite) {
					args.push('--build', '--force', `tsconfig.${build.format}.json`);
				} else {
					args.push(
						'--declaration',
						'--declarationDir',
						build.format,
						'--declarationMap',
						'--emitDeclarationOnly',
						'--project',
						`tsconfig.${build.format}.json`,
					);
				}

				return execa('tsc', args, {
					cwd: this.package.path.path(),
					preferLocal: true,
				});
			}),
		);

		if (this.features.cjsTypesCompat) {
			const hasCjs = this.builds.some((build) => build.format === 'cjs');

			if (hasCjs) {
				this.debug('CJS types compatibility enabled, renaming `.d.ts` to `.d.cts`');

				const dtsFiles = await glob('**/*.d.ts', {
					absolute: true,
					cwd: this.package.path.append('cjs').path(),
				});

				await Promise.all(
					dtsFiles.map((dtsFile) => {
						const dtsPath = Path.create(dtsFile);
						const dtsName = dtsPath.name();

						return fs.rename(
							dtsPath.path(),
							dtsPath.parent().append(dtsName.replace('.d.ts', '.d.cts')).path(),
						);
					}),
				);
			}
		}
	}

	async clean() {
		this.debug('Cleaning artifact directories');

		const dirs = ['assets', 'dts', ...this.builds.map((build) => build.format)];

		await Promise.all(
			dirs.map(async (dir) => {
				const dirPath = this.package.path.append(dir).path();

				this.debug('  - %s', dirPath);

				await fs.remove(dirPath);
			}),
		);
	}

	findEntryPoint(formats: Format[], outputName: string) {
		for (const format of formats) {
			const build = this.builds.find((build) => build.format === format);

			if (build) {
				return this.getBuildOutput(format, outputName, build.declaration);
			}
		}

		return undefined;
	}

	// eslint-disable-next-line complexity
	getBuildOutput(format: Format, outputName: string, declaration: boolean = false) {
		const inputFile = this.inputs[outputName];
		const inputPath = inputFile ? removeSourcePath(inputFile) : undefined;
		let outputPath = outputName;

		// When using a public API, we do not create output files based on the input map.
		// Instead files mirror the source file structure, so we need to take that into account!
		if ((this.api === 'public' || !this.bundle) && inputPath) {
			outputPath = inputPath;
		}

		const folder = format === 'lib' && this.sharedLib ? `lib/${this.platform}` : format;
		// Folder path for declarations cannot have the platform subpath, since multiple builds can
		// share the same tsconfig
		const declFolder = format;
		const entryExt = format === 'cjs' || format === 'mjs' ? format : 'js';
		let declExt: string | undefined;

		if (declaration) {
			if (format === 'cjs' && this.features.cjsTypesCompat) {
				declExt = 'd.cts';
			} else if (!inputFile || /\.tsx?$/.test(inputFile)) {
				declExt = 'd.ts';
			} else if (inputFile.endsWith('.cts')) {
				declExt = 'd.cts';
			} else if (inputFile.endsWith('.mts')) {
				declExt = 'd.mts';
			}
		}

		return {
			declExt,
			declPath: declExt
				? `./${new VirtualPath(declFolder, `${inputPath ?? outputPath}.${declExt}`)}`
				: undefined,
			entryExt,
			entryPath: `./${new VirtualPath(folder, `${outputPath}.${entryExt}`)}`,
			folder,
		};
	}

	getIndexInput(): string {
		return this.inputs.index ? 'index' : Object.keys(this.inputs)[0];
	}

	getInputPaths(): InputMap {
		return Object.fromEntries(
			Object.entries(this.inputs).map(([outputName, inputFile]) => [
				outputName,
				// Return absolute paths so that Rollup paths/externals resolve correctly
				this.package.path.append(inputFile).path(),
			]),
		);
	}

	getLabel(): string {
		return `${this.platform}:${this.support}:${this.builds.map((build) => build.format).join(',')}`;
	}

	getPackageExports(features: FeatureFlags): PackageExports {
		const exportMap: PackageExports = {};

		if (this.api === 'private' || this.bundle) {
			Object.keys(this.inputs).forEach((outputName) => {
				this.mapPackageExportsFromBuilds(outputName, exportMap, features);
			});
		} else {
			// Use subpath export patterns when not bundling
			// https://nodejs.org/api/packages.html#subpath-patterns
			this.mapPackageExportsFromBuilds('*', exportMap, features);
			this.mapPackageExportsFromBuilds(this.getIndexInput(), exportMap, features, true);
		}

		return exportMap;
	}

	isComplete(): boolean {
		return this.state === 'passed' || this.state === 'failed';
	}

	isRunning(): boolean {
		return this.state === 'building';
	}

	toString(): string {
		return this.getLabel();
	}

	// eslint-disable-next-line complexity
	protected mapPackageExportsFromBuilds(
		outputName: string,
		exportMap: PackageExports,
		features: FeatureFlags,
		index: boolean = false,
	) {
		const defaultEntry = this.findEntryPoint(['lib'], outputName);
		let paths: PackageExportPaths = {};

		switch (this.platform) {
			case 'electron':
			case 'browser': {
				const esmEntry = this.findEntryPoint(['esm'], outputName);

				if (esmEntry) {
					paths = {
						types: esmEntry.declPath,
						module: esmEntry.entryPath, // Bundlers
						import: esmEntry.entryPath,
					};
				}

				// Node.js tooling
				const libEntry = this.findEntryPoint(['umd', 'lib'], outputName);

				paths.types ??= libEntry?.declPath;
				paths.default = libEntry?.entryPath;

				break;
			}

			case 'node': {
				const mjsEntry = this.findEntryPoint(['mjs'], outputName);
				const cjsEntry = this.findEntryPoint(['cjs'], outputName);

				if (mjsEntry && cjsEntry) {
					paths = {
						import: {
							types: mjsEntry.declPath,
							default: mjsEntry.entryPath,
						},
						require: {
							types: cjsEntry.declPath,
							default: cjsEntry.entryPath,
						},
					};
				} else if (mjsEntry) {
					paths = {
						types: mjsEntry.declPath,
						import: mjsEntry.entryPath,
					};
				} else if (cjsEntry) {
					paths = {
						types: cjsEntry.declPath,
						require: cjsEntry.entryPath,
					};

					// Automatically apply the mjs wrapper for cjs
					if (!paths.import && outputName !== '*') {
						paths.import = cjsEntry.entryPath.replace('.cjs', '-wrapper.mjs');
					}
				}

				if (defaultEntry) {
					if (!paths.types && !isObject(paths.import) && !isObject(paths.require)) {
						paths.types = defaultEntry.declPath;
					}

					if (!paths.require) {
						paths.default = defaultEntry.entryPath;
					}
				}

				break;
			}

			case 'native':
				paths.types = defaultEntry?.declPath;
				paths.default = defaultEntry?.entryPath;
				break;

			default:
				break;
		}

		const pathsMap: Record<string, PackageExportPaths | string> = {
			[this.platform === 'native' ? 'react-native' : this.platform]: paths,
		};

		// Point to the source files when using solid
		if (features.solid) {
			if (outputName === '*') {
				pathsMap.solid = `./src/*.${features.typescript ? 'tsx' : 'js'}`;
			} else {
				const input = this.inputs[outputName];

				pathsMap.solid = input.startsWith('./') ? input : `./${input}`;
			}
		}

		// Provide fallbacks if condition above is not
		if (defaultEntry) {
			pathsMap.default = defaultEntry.entryPath;
			pathsMap.types = defaultEntry.declPath!;
		}

		// eslint-disable-next-line no-param-reassign
		exportMap[index || outputName === 'index' ? '.' : `./${outputName}`] = pathsMap;
	}

	protected logWithSource(
		message: string,
		level: 'error' | 'info' | 'warn',
		{
			id,
			output,
			sourceColumn,
			sourceFile,
			sourceLine,
		}: {
			id?: string;
			output?: string;
			sourceColumn?: number;
			sourceFile?: string;
			sourceLine?: number;
		} = {},
	) {
		let msg = `[${this.package.getName()}${output ? `:${output}` : ''}] ${message}`;

		const meta: string[] = [];

		if (id) {
			meta.push(`id=${id}`);
		}

		if (sourceFile) {
			meta.push(
				`file=${new Path(sourceFile).path().replace(this.package.path.path(), '').slice(1)}`,
			);
		}

		if (sourceLine || sourceColumn) {
			meta.push(`line=${sourceLine ?? '?'}:${sourceColumn ?? '?'}`);
		}

		if (meta.length > 0) {
			msg += applyStyle(` (${meta.join(' ')})`, 'muted');
		}

		console[level](msg);
	}
}
