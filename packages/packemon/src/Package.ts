/* eslint-disable require-atomic-updates, no-param-reassign, @typescript-eslint/member-ordering */

import glob from 'fast-glob';
import fs from 'fs-extra';
import { isObject, Memoize, PackageStructure, Path, toArray } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { CodeArtifact } from './CodeArtifact';
import {
	DEFAULT_FORMATS,
	EXCLUDE,
	FORMATS_BROWSER,
	FORMATS_NATIVE,
	FORMATS_NODE,
	NODE_SUPPORTED_VERSIONS,
	NPM_SUPPORTED_VERSIONS,
	SUPPORT_PRIORITY,
} from './constants';
import { loadModule } from './helpers/loadModule';
import { Project } from './Project';
import { packemonBlueprint } from './schemas';
import {
	BuildOptions,
	ConfigFile,
	FeatureFlags,
	InputMap,
	PackageConfig,
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

		// Sync `package.json` in case it was modified
		await this.syncPackageJson();
	}

	async cleanup(): Promise<void> {
		this.debug('Cleaning build artifacts');

		await Promise.all(this.artifacts.map((artifact) => artifact.cleanup()));
	}

	async findDistributableFiles(): Promise<string[]> {
		// https://github.com/npm/npm-packlist/blob/main/index.js#L29
		const patterns: string[] = ['(readme|copying|license|licence)*', 'package.json'];

		this.packageJson.files?.forEach((file) => {
			if (file.endsWith('/')) {
				patterns.push(`${file}**/*`);
			} else {
				patterns.push(file);
			}
		});

		return glob(patterns, {
			caseSensitiveMatch: false,
			cwd: this.path.path(),
			dot: true,
			ignore: ['node_modules'],
		});
	}

	getName(): string {
		return this.packageJson.name;
	}

	@Memoize()
	// eslint-disable-next-line complexity
	getFeatureFlags(): FeatureFlags {
		this.debug('Loading feature flags');

		const flags: FeatureFlags =
			this.root || !this.project.isWorkspacesEnabled()
				? {}
				: this.project.rootPackage.getFeatureFlags();

		if (this.project.workspaces.length > 0) {
			flags.workspaces = this.project.workspaces;
		}

		// React
		if (this.project.rootPackage.hasDependency('react') || this.hasDependency('react')) {
			flags.react = true;

			this.debug(' - React');
		}

		// TypeScript
		const tsConfig = this.tsconfigJson ?? this.project.rootPackage.tsconfigJson;

		if (
			this.project.rootPackage.hasDependency('typescript') ||
			this.hasDependency('typescript') ||
			tsConfig
		) {
			flags.typescript = true;
			flags.decorators = Boolean(tsConfig?.options.experimentalDecorators);
			flags.strict = Boolean(tsConfig?.options.strict);

			this.debug(
				' - TypeScript (%s, %s)',
				flags.strict ? 'strict' : 'non-strict',
				flags.decorators ? 'decorators' : 'non-decorators',
			);
		}

		// Flow
		const flowconfigPath = this.project.root.append('.flowconfig');

		if (
			this.project.rootPackage.hasDependency('flow-bin') ||
			this.hasDependency('flow-bin') ||
			flowconfigPath.exists()
		) {
			flags.flow = true;

			this.debug(' - Flow');
		}

		return flags;
	}

	getSlug(): string {
		return this.path.name(true);
	}

	@Memoize()
	getSourceFiles(): string[] {
		return glob
			.sync('src/**/*.{js,jsx,ts,tsx}', {
				absolute: true,
				cwd: this.path.path(),
				onlyFiles: true,
				// This breaks our own fixtures, so this is hard to test...
				ignore: process.env.NODE_ENV === 'test' ? [] : EXCLUDE,
			})
			.map((file) => new Path(file).path());
	}

	hasDependency(name: string): boolean {
		const pkg = this.packageJson;

		return Boolean(
			pkg.dependencies?.[name] ??
				pkg.devDependencies?.[name] ??
				pkg.peerDependencies?.[name] ??
				pkg.optionalDependencies?.[name],
		);
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

			toArray(config.platform).forEach((platform) => {
				let { api, bundle } = config;
				let formats = [...toArray(config.format)];
				const isEmpty = formats.length === 0;

				switch (platform) {
					case 'native':
						if (isEmpty) {
							formats.push(...DEFAULT_FORMATS.native);
						} else {
							formats = formats.filter((format) => (FORMATS_NATIVE as string[]).includes(format));
						}
						break;

					case 'node':
						if (cfg.api === undefined) {
							api = 'public';
						}

						if (cfg.bundle === undefined) {
							bundle = false;
						}

						if (isEmpty) {
							formats.push(...DEFAULT_FORMATS.node);
						} else {
							formats = formats.filter((format) => (FORMATS_NODE as string[]).includes(format));
						}
						break;

					case 'browser':
					default:
						if (isEmpty) {
							formats.push(...DEFAULT_FORMATS.browser);

							if (config.namespace) {
								formats.push('umd');
							}
						} else {
							formats = formats.filter((format) => (FORMATS_BROWSER as string[]).includes(format));
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

	@Memoize()
	get tsconfigJson(): TSConfigStructure | undefined {
		const tsconfigJsonPath = this.path.append('tsconfig.json');

		if (!tsconfigJsonPath.exists()) {
			return undefined;
		}

		const ts = loadModule(
			'typescript',
			'TypeScript is required for config loading.',
		) as typeof import('typescript');

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const { config, error } = ts.readConfigFile(tsconfigJsonPath.path(), (name) =>
			fs.readFileSync(name, 'utf8'),
		);

		const host = {
			getCanonicalFileName: (fileName: string) => fileName,
			getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
			getNewLine: () => ts.sys.newLine,
		};

		// istanbul ignore next
		if (error) {
			throw new Error(ts.formatDiagnostic(error, host));
		}

		const result = ts.parseJsonConfigFileContent(
			config,
			ts.sys,
			this.path.path(),
			{},
			tsconfigJsonPath.path(),
		);

		// istanbul ignore next
		if (result.errors.length > 0) {
			throw new Error(ts.formatDiagnostics(result.errors, host));
		}

		return result;
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

		let mainEntry = '';
		let moduleEntry = '';
		let browserEntry = '';

		// eslint-disable-next-line complexity
		this.artifacts.forEach((artifact) => {
			// Build files
			if (artifact instanceof CodeArtifact) {
				// Generate `main`, `module`, and `browser` fields
				if (artifact.inputs.index) {
					if (!mainEntry || artifact.platform === 'node') {
						mainEntry = artifact.findEntryPoint(['lib', 'cjs', 'mjs', 'esm'], 'index');
					}

					if (!moduleEntry) {
						moduleEntry = artifact.findEntryPoint(['esm', 'mjs'], 'index');
					}

					// Only include when we share a lib with another platform
					if (!browserEntry && artifact.platform === 'browser') {
						browserEntry = artifact.findEntryPoint(
							artifact.sharedLib ? ['lib', 'umd'] : ['umd'],
							'index',
						);
					}
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
				this.packageJson.types = artifact.findEntryPoint('index');
			}
		});

		if (mainEntry) {
			this.packageJson.main = mainEntry;

			if (mainEntry.includes('mjs/') || mainEntry.includes('esm/')) {
				this.packageJson.type = 'module';
			} else if (mainEntry.includes('cjs/')) {
				this.packageJson.type = 'commonjs';
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

		const exportMap: PackageExports = {
			'./package.json': './package.json',
		};

		this.artifacts.forEach((artifact) => {
			Object.entries(artifact.getPackageExports()).forEach(([basePath, conditions]) => {
				const path = basePath.replace('/index', '');

				if (!exportMap[path]) {
					exportMap[path] = {};
				} else if (typeof exportMap[path] === 'string') {
					exportMap[path] = { default: exportMap[path] };
				}

				Object.assign(exportMap[path], conditions);
			});
		});

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
					files.add(`${format}/**/*.{${artifact.getBuildOutput(format).ext},map}`);
				});

				files.add(`src/**/*.{${this.getSourceFileExts(artifact.inputs)}}`);
			}

			// Type declarations
			if (artifact instanceof TypesArtifact) {
				files.add('dts/**/*.d.ts');
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
