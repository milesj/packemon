import execa from 'execa';
import fs from 'fs-extra';
import { rollup } from 'rollup';
import { applyStyle } from '@boost/cli';
import { Path, PortablePath, toArray, VirtualPath } from '@boost/common';
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
	async build(options: BuildOptions, packemonConfig: ConfigFile): Promise<void> {
		const features = this.package.getFeatureFlags();

		await Promise.all([this.buildCode(features, packemonConfig), this.buildTypes(features)]);
	}

	/**
	 * Build code artifacts using Rollup. We'll spin up a Rollup instance for each output,
	 * as Rollup will then generate all the necessary formats. For example:
	 * index -> cjs, lib.
	 */
	async buildCode(features: FeatureFlags, packemonConfig: ConfigFile): Promise<void> {
		this.debug('Building code artifacts with Rollup');

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
	 * for each format, as they may require different declaration outputs.
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

				// Project references
				if (features.typescriptComposite) {
					args.push('--build', `tsconfig.${build.format}.json`);
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
	}

	async clean() {}

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

	isComplete(): boolean {
		return this.state === 'passed' || this.state === 'failed';
	}

	isRunning(): boolean {
		return this.state === 'building';
	}

	toString(): string {
		return this.getLabel();
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

	protected async removeFiles(files: PortablePath[]): Promise<unknown> {
		return Promise.all(files.map((file) => fs.remove(String(file))));
	}

	// abstract build(options: BuildOptions, packemonConfig: ConfigFile): Awaitable;

	// abstract getLabel(): string;

	// abstract getBuildTargets(): string[];

	// abstract getPackageExports(): PackageExports;
}
