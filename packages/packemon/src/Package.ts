/* eslint-disable require-atomic-updates, no-param-reassign, @typescript-eslint/member-ordering */

import glob from 'fast-glob';
import fs from 'fs-extra';
import semver from 'semver';
import { deepMerge, isObject, Memoize, PackageStructure, Path, toArray } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { CodeArtifact } from './CodeArtifact';
import {
	DEFAULT_FORMATS,
	EXCLUDE,
	EXTENSIONS,
	FORMATS_BROWSER,
	FORMATS_NATIVE,
	FORMATS_NODE,
	NODE_SUPPORTED_VERSIONS,
	NPM_SUPPORTED_VERSIONS,
	SUPPORT_PRIORITY,
} from './constants';
import { loadModule } from './helpers/loadModule';
import { sortExports } from './helpers/sortExports';
import { Project } from './Project';
import { packemonBlueprint } from './schemas';
import {
	BuildOptions,
	ConfigFile,
	FeatureFlags,
	InputMap,
	PackageConfig,
	PackageExportPaths,
	PackageExports,
	PackemonPackage,
	PackemonPackageConfig,
	TSConfigStructure,
} from './types';
import { TypesArtifact } from './TypesArtifact';

export class Package {
	readonly artifacts: Artifact[] = [];

	readonly configs: PackageConfig[] = [];

	readonly debug!: Debugger;

	readonly packageJson: PackemonPackage;

	readonly packageJsonPath: Path;

	readonly path: Path;

	readonly project: Project;

	root: boolean = false;

	constructor(project: Project, path: Path, contents: PackemonPackage) {
		this.project = project;
		this.path = path;
		this.packageJsonPath = this.path.append('package.json');
		this.packageJson = contents;
		this.debug = createDebugger(['packemon', 'package', this.getSlug()]);
	}

	addArtifact(artifact: Artifact): Artifact {
		this.artifacts.push(artifact);

		artifact.startup();

		return artifact;
	}

	async build(options: BuildOptions, packemonConfig: ConfigFile): Promise<void> {
		this.debug('Building artifacts');

		// Build artifacts in parallel
		await Promise.all(
			this.artifacts.map(async (artifact) => {
				const start = Date.now();

				try {
					artifact.state = 'building';

					await artifact.build(options, packemonConfig);

					artifact.state = 'passed';
				} catch (error: unknown) {
					artifact.state = 'failed';

					throw error;
				} finally {
					artifact.buildResult.time = Date.now() - start;
				}
			}),
		);

		// Add package entry points based on artifacts
		this.addEntryPoints();

		// Add package `engines` based on artifacts
		if (options.addEngines) {
			this.addEngines();
		}

		// Add package `exports` based on artifacts
		if (options.addExports) {
			this.addExports();
		}

		// Add package `files` whitelist
		if (options.addFiles) {
			this.addFiles();
		}

		// Stamp with a timestamp
		if (options.stamp) {
			this.packageJson.release = String(Date.now());
		}

		// Sync `package.json` in case it was modified
		await this.syncPackageJson();
	}

	async cleanup(): Promise<void> {
		this.debug('Cleaning build artifacts');

		await Promise.all(this.artifacts.map((artifact) => artifact.cleanup()));
	}

	getName(): string {
		return this.packageJson.name;
	}

	getSlug(): string {
		return this.path.name(true);
	}

	@Memoize()
	getSourceFiles(): string[] {
		const extsWithoutPeriod = EXTENSIONS.map((ext) => ext.slice(1)).join(',');

		return glob
			.sync(`src/**/*.{${extsWithoutPeriod}}`, {
				absolute: true,
				cwd: this.path.path(),
				onlyFiles: true,
				// This breaks our own fixtures, so this is hard to test...
				ignore: process.env.NODE_ENV === 'test' ? [] : EXCLUDE,
			})
			.map((file) => new Path(file).path());
	}

	isComplete(): boolean {
		return this.artifacts.every((artifact) => artifact.isComplete());
	}

	isRunning(): boolean {
		return this.artifacts.some((artifact) => artifact.isRunning());
	}

	setConfigs(configs: PackemonPackageConfig[]) {
		configs.forEach((cfg) => {
			const config = optimal(packemonBlueprint, {
				name: this.getName(),
			}).validate(cfg);

			// eslint-disable-next-line complexity
			toArray(config.platform).forEach((platform) => {
				let { api, bundle } = config;
				let formats = config.format ? [config.format] : [];

				switch (platform) {
					case 'native':
						formats = formats.filter((format) => (FORMATS_NATIVE as string[]).includes(format));

						if (formats.length === 0) {
							formats.push(DEFAULT_FORMATS.native);
						}
						break;

					case 'node':
						if (cfg.api === undefined) {
							api = 'public';
						}

						if (cfg.bundle === undefined) {
							bundle = false;
						}

						formats = formats.filter((format) => (FORMATS_NODE as string[]).includes(format));

						if (formats.length === 0) {
							formats.push(DEFAULT_FORMATS.node);
						}
						break;

					default:
						formats = formats.filter((format) => (FORMATS_BROWSER as string[]).includes(format));

						if (formats.length === 0) {
							formats.push(DEFAULT_FORMATS.browser);
						}

						// Auto-support lib builds for test environments
						if (formats.includes('esm') && !formats.includes('lib')) {
							formats.push('lib');
						}

						if (config.namespace && !formats.includes('umd')) {
							formats.push('umd');
						}
						break;
				}

				this.configs.push({
					api,
					bundle,
					externals: toArray(config.externals),
					formats,
					inputs: config.inputs,
					namespace: config.namespace,
					platform,
					support: config.support,
				});
			});
		});
	}

	async syncPackageJson() {
		await fs.writeJson(this.packageJsonPath.path(), this.packageJson, { spaces: 2 });
	}

	protected addEngines() {
		const artifact = (this.artifacts as CodeArtifact[])
			.filter((art) => art instanceof CodeArtifact)
			.filter((art) => art.platform === 'node')
			.reduce<CodeArtifact | null>(
				(oldest, art) =>
					!oldest || SUPPORT_PRIORITY[art.support] < SUPPORT_PRIORITY[oldest.support]
						? art
						: oldest,
				null,
			);

		if (!artifact) {
			return;
		}

		this.debug('Adding `engines` to `package.json`');

		const pkg = this.packageJson;

		if (!pkg.engines) {
			pkg.engines = {};
		}

		Object.assign(pkg.engines, {
			node: `>=${NODE_SUPPORTED_VERSIONS[artifact.support]}`,
			npm: toArray(NPM_SUPPORTED_VERSIONS[artifact.support])
				.map((v) => `>=${v}`)
				.join(' || '),
		});
	}

	protected addEntryPoints() {
		this.debug('Adding entry points to `package.json`');

		let mainEntry: string | undefined;
		let moduleEntry: string | undefined;
		let browserEntry: string | undefined;
		let buildCount = 0;

		// eslint-disable-next-line complexity
		this.artifacts.forEach((artifact) => {
			// Build files
			if (artifact instanceof CodeArtifact) {
				const mainEntryName = artifact.inputs.index ? 'index' : Object.keys(artifact.inputs)[0];

				buildCount += artifact.builds.length;

				// Generate `main`, `module`, and `browser` fields
				if (!mainEntry || (artifact.platform === 'node' && mainEntryName === 'index')) {
					mainEntry = artifact.findEntryPoint(['lib', 'cjs', 'mjs', 'esm'], mainEntryName);
				}

				if (!moduleEntry || (artifact.platform === 'browser' && mainEntryName === 'index')) {
					moduleEntry = artifact.findEntryPoint(['esm'], mainEntryName);
				}

				// Only include when we share a lib with another platform
				if (!browserEntry && artifact.platform === 'browser') {
					browserEntry = artifact.findEntryPoint(
						artifact.sharedLib ? ['lib', 'umd'] : ['umd'],
						mainEntryName,
					);
				}

				// Generate `bin` field
				if (
					artifact.inputs.bin &&
					artifact.platform === 'node' &&
					!isObject(this.packageJson.bin)
				) {
					this.packageJson.bin = artifact.findEntryPoint(['lib', 'cjs', 'mjs'], 'bin');
				}
			}

			// Type declarations
			if (artifact instanceof TypesArtifact) {
				const mainEntryName = artifact.builds.some((build) => build.outputName === 'index')
					? 'index'
					: artifact.builds[0].outputName;

				this.packageJson.types = artifact.findEntryPoint(mainEntryName);
			}
		});

		if (mainEntry) {
			this.packageJson.main = mainEntry;

			// Only set when we have 1 build, otherwise its confusing
			if (buildCount === 1) {
				if (mainEntry.includes('mjs/') || mainEntry.includes('esm/')) {
					this.packageJson.type = 'module';
				} else if (mainEntry.includes('cjs/')) {
					this.packageJson.type = 'commonjs';
				}
			}
		}

		if (moduleEntry) {
			this.packageJson.module = moduleEntry;
		}

		if (browserEntry && !isObject(this.packageJson.browser)) {
			this.packageJson.browser = browserEntry;
		}
	}

	protected addExports() {
		this.debug('Adding `exports` to `package.json`');

		let exportMap: PackageExports = {
			'./package.json': './package.json',
		};

		this.artifacts.forEach((artifact) => {
			Object.entries(artifact.getPackageExports()).forEach(([path, conditions]) => {
				if (!conditions) {
					return;
				}

				if (!exportMap[path]) {
					exportMap[path] = conditions;
					return;
				}

				if (typeof exportMap[path] === 'string') {
					exportMap[path] = { default: exportMap[path] };
				}

				exportMap[path] = deepMerge<PackageExportPaths, PackageExportPaths>(
					exportMap[path] as PackageExportPaths,
					typeof conditions === 'string' ? { default: conditions } : conditions,
				);
			});
		});

		exportMap = sortExports(exportMap);

		if (isObject(this.packageJson.exports)) {
			Object.assign(this.packageJson.exports, exportMap);
		} else {
			this.packageJson.exports = exportMap as PackageStructure['exports'];
		}
	}

	protected addFiles() {
		this.debug('Adding files to `package.json`');

		const files = new Set<string>(this.packageJson.files);

		try {
			if (this.path.append('assets').exists()) {
				files.add('assets/**/*');
			}
		} catch {
			// May throw ENOENT
		}

		this.artifacts.forEach((artifact) => {
			// Build files
			if (artifact instanceof CodeArtifact) {
				artifact.builds.forEach(({ format }) => {
					files.add(`${format}/**/*.{${artifact.getBuildOutput(format).extGroup}}`);
				});

				files.add(`src/**/*.{${this.getSourceFileExts(artifact.inputs)}}`);
			}

			// Type declarations
			if (artifact instanceof TypesArtifact) {
				files.add(`dts/**/*.${artifact.getDeclExt()}`);
			}
		});

		this.packageJson.files = [...files].sort();
	}

	protected getSourceFileExts(inputs: InputMap): string[] {
		const sourceExts = Object.values(inputs).map((inputFile) => new Path(inputFile).ext(true));
		const exts = new Set(sourceExts);

		// Include sibling file extensions
		sourceExts.forEach((sourceExt) => {
			switch (sourceExt) {
				case 'js':
					exts.add('jsx');
					break;

				case 'jsx':
				case 'cjs':
					exts.add('js');
					break;

				case 'ts':
					exts.add('tsx');
					break;

				case 'tsx':
					exts.add('ts');
					break;

				// no default
			}
		});

		const list = [...exts].sort();

		// Always be last
		list.push('json');

		return list;
	}
}
