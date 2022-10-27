/* eslint-disable require-atomic-updates */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/member-ordering */

import glob from 'fast-glob';
import fs from 'fs-extra';
import semver from 'semver';
import { isObject, Memoize, Path, toArray } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import {
	DEFAULT_FORMATS,
	EXCLUDE,
	EXTENSIONS,
	FORMATS_BROWSER,
	FORMATS_NATIVE,
	FORMATS_NODE,
	NODE_SUPPORTED_VERSIONS,
	SUPPORT_PRIORITY,
} from './constants';
import { loadTsconfigJson } from './helpers/loadTsconfigJson';
import { matchesPattern } from './helpers/matchesPattern';
import { packemonBlueprint } from './schemas';
import {
	ApiType,
	BuildOptions,
	ConfigFile,
	FeatureFlags,
	PackageConfig,
	PackemonPackage,
	PackemonPackageConfig,
	Platform,
} from './types';

export class Package {
	readonly artifacts: Artifact[] = [];

	readonly configs: PackageConfig[] = [];

	readonly debug!: Debugger;

	readonly json: PackemonPackage;

	readonly jsonPath: Path;

	readonly path: Path;

	readonly workspaceRoot: Path;

	constructor(path: Path, contents: PackemonPackage, workspaceRoot?: Path) {
		this.path = path;
		this.jsonPath = this.path.append('package.json');
		this.json = contents;
		this.workspaceRoot = workspaceRoot ?? path;
		this.debug = createDebugger(['packemon', 'package', this.getSlug()]);

		if (!isObject(contents.packemon) && !Array.isArray(contents.packemon)) {
			throw new Error(
				`Invalid \`packemon\` configuration for ${contents.name}, must be an object or array of objects.`,
			);
		}

		this.setConfigs(toArray(contents.packemon));
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
			// this.addExports();
		}

		// Add package `files` whitelist
		if (options.addFiles) {
			this.addFiles();
		}

		// Stamp with a timestamp
		if (options.stamp) {
			this.json.release = String(Date.now());
		}

		// Sync `package.json` in case it was modified
		await this.syncJson();
	}

	async clean(): Promise<void> {
		this.debug('Cleaning build artifacts');

		await Promise.all(this.artifacts.map((artifact) => artifact.clean()));
	}

	@Memoize()
	async findDistributableFiles(): Promise<string[]> {
		// https://github.com/npm/npm-packlist/blob/main/index.js#L29
		const patterns: string[] = ['(readme|copying|license|licence)*', 'package.json'];

		this.json.files?.forEach((file) => {
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

	@Memoize()
	async findSourceFiles(): Promise<string[]> {
		const extsWithoutPeriod = EXTENSIONS.map((ext) => ext.slice(1)).join(',');

		const files = await glob(`src/**/*.{${extsWithoutPeriod}}`, {
			absolute: true,
			cwd: this.path.path(),
			onlyFiles: true,
			// This breaks our own fixtures, so this is hard to test...
			ignore: process.env.NODE_ENV === 'test' ? [] : EXCLUDE,
		});

		files.sort();

		return files.map((file) => new Path(file).path());
	}

	/**
	 * Generate artifacts based on the packemon configuration.
	 */
	generateArtifacts({ declaration, filterFormats, filterPlatforms }: BuildOptions = {}) {
		this.debug('Generating artifacts');

		const sharedLib = this.requiresSharedLib();
		const apiType = this.determineApiType();

		this.configs.forEach((config, index) => {
			let builds = config.formats.map((format) => ({
				declaration,
				format,
			}));

			if (filterFormats) {
				this.debug('Filtering formats with pattern: %s', filterFormats);

				builds = builds.filter((build) => matchesPattern(build.format, filterFormats));
			}

			if (filterPlatforms) {
				this.debug('Filtering platforms with pattern: %s', filterPlatforms);

				if (!matchesPattern(config.platform, filterPlatforms)) {
					return;
				}
			}

			if (builds.length === 0) {
				return;
			}

			const artifact = new Artifact(this, builds);
			artifact.api = apiType;
			artifact.bundle = config.bundle;
			artifact.configGroup = index;
			artifact.externals = config.externals;
			artifact.inputs = config.inputs;
			artifact.namespace = config.namespace;
			artifact.platform = config.platform;
			artifact.sharedLib = sharedLib;
			artifact.support = config.support;

			this.artifacts.push(artifact);

			this.debug(' - %s', artifact);
		});
	}

	@Memoize()
	// eslint-disable-next-line complexity
	getFeatureFlags(): FeatureFlags {
		this.debug('Loading feature flags');

		const flags: FeatureFlags = {};

		// React
		if (this.hasDependency('react')) {
			const peerDep = this.json.peerDependencies?.react;
			const prodDep = this.json.dependencies?.react;
			const versionsToCheck: string[] = [];

			if (peerDep && peerDep !== '*') {
				versionsToCheck.push(...peerDep.split('||'));
			} else if (prodDep && prodDep !== '*') {
				versionsToCheck.push(prodDep);
			}

			// New JSX transform was backported to these versions:
			// https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
			const automatic = versionsToCheck.every((version) => {
				const coercedVersion = semver.coerce(version.trim().replace(/(>|<|=|~|^)/g, ''));

				if (coercedVersion === null) {
					return false;
				}

				return semver.satisfies(
					coercedVersion.version,
					'>=17.0.0 || ^16.14.0 || ^15.7.0 || ^0.14.0',
				);
			});

			flags.react = automatic && versionsToCheck.length > 0 ? 'automatic' : 'classic';

			this.debug(' - React');
		}

		// Solid
		if (this.hasDependency('solid-js')) {
			flags.solid = true;

			this.debug(' - Solid');
		}

		// TypeScript
		if (
			this.hasDependency('typescript') ||
			this.path.append('tsconfig.json').exists() ||
			this.workspaceRoot.append('tsconfig.json').exists()
		) {
			const tsConfig = loadTsconfigJson(this.path.append('tsconfig.json'));

			flags.typescript = true;
			flags.typescriptComposite = Boolean(
				tsConfig?.options?.composite ||
					(tsConfig?.projectReferences && tsConfig?.projectReferences.length > 0),
			);
			flags.decorators = Boolean(tsConfig?.options.experimentalDecorators);
			flags.strict = Boolean(tsConfig?.options.strict);

			this.debug(
				' - TypeScript (%s, %s)',
				flags.strict ? 'strict' : 'non-strict',
				flags.decorators ? 'decorators' : 'non-decorators',
			);
		}

		// Flow
		if (
			this.hasDependency('flow-bin') ||
			this.path.append('.flowconfig').exists() ||
			this.workspaceRoot.append('.flowconfig').exists()
		) {
			flags.flow = true;

			this.debug(' - Flow');
		}

		return flags;
	}

	getName(): string {
		return this.json.name;
	}

	getSlug(): string {
		return this.path.name(true);
	}

	hasDependency(name: string): boolean {
		const { json } = this;

		return Boolean(
			json.dependencies?.[name] ??
				json.devDependencies?.[name] ??
				json.peerDependencies?.[name] ??
				json.optionalDependencies?.[name],
		);
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

	async syncJson() {
		await fs.writeJson(this.jsonPath.path(), this.json, { spaces: 2 });
	}

	protected addEngines() {
		const artifact = this.artifacts
			.filter((art) => art.platform === 'node')
			.reduce<Artifact | null>(
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

		if (!this.json.engines) {
			this.json.engines = {};
		}

		Object.assign(this.json.engines, {
			node: `>=${NODE_SUPPORTED_VERSIONS[artifact.support]}`,
		});
	}

	protected addEntryPoints() {
		this.debug('Adding entry points to `package.json`');

		let mainEntry: string | undefined;
		let typesEntry: string | undefined;
		let moduleEntry: string | undefined;
		let browserEntry: string | undefined;

		// eslint-disable-next-line complexity
		this.artifacts.forEach((artifact) => {
			const mainEntryName = artifact.inputs.index ? 'index' : Object.keys(artifact.inputs)[0];

			// Generate `main`, `module`, and `browser` fields
			if (!mainEntry || (artifact.platform === 'node' && mainEntryName === 'index')) {
				const entry = artifact.findEntryPoint(['lib', 'cjs', 'mjs', 'esm'], mainEntryName);

				if (entry) {
					mainEntry = entry.entryPath;
					typesEntry = entry.declPath;
				}
			}

			if (!moduleEntry || (artifact.platform === 'browser' && mainEntryName === 'index')) {
				moduleEntry = artifact.findEntryPoint(['esm'], mainEntryName)?.entryPath;
			}

			// Only include when we share a lib with another platform
			if (!browserEntry && artifact.platform === 'browser') {
				browserEntry = artifact.findEntryPoint(
					artifact.sharedLib ? ['lib', 'umd'] : ['umd'],
					mainEntryName,
				)?.entryPath;
			}

			// Generate `bin` field
			if (artifact.inputs.bin && artifact.platform === 'node' && !isObject(this.json.bin)) {
				this.json.bin = artifact.findEntryPoint(['lib', 'cjs', 'mjs'], 'bin')?.entryPath;
			}
		});

		if (mainEntry) {
			this.json.main = mainEntry;
		}

		if (typesEntry) {
			this.json.types = typesEntry;
		}

		if (moduleEntry) {
			this.json.module = moduleEntry;
		}

		if (browserEntry && !isObject(this.json.browser)) {
			this.json.browser = browserEntry;
		}
	}

	protected addFiles() {
		this.debug('Adding files to `package.json`');

		const files = new Set<string>(this.json.files);

		try {
			if (this.path.append('assets').exists()) {
				files.add('assets/**/*');
			}
		} catch {
			// May throw ENOENT
		}

		this.artifacts.forEach((artifact) => {
			artifact.builds.forEach(({ format }) => {
				files.add(`${format}/**/*`);
			});

			files.add(`src/**/*`);
		});

		this.json.files = [...files].sort();
	}

	/**
	 * When 1 config needs a private API, all other configs should be private,
	 * otherwise we will have conflicting output structures and exports.
	 */
	protected determineApiType(): ApiType {
		return this.configs.some((cfg) => cfg.api === 'private') ? 'private' : 'public';
	}

	/**
	 * Format "lib" is a shared format across all platforms,
	 * and when a package wants to support multiple platforms,
	 * we must account for this and alter the output paths.
	 */
	protected requiresSharedLib(): boolean {
		const platformsToCheck = new Set<Platform>();
		let libFormatCount = 0;

		this.configs.forEach((config) => {
			platformsToCheck.add(config.platform);

			config.formats.forEach((format) => {
				if (format === 'lib') {
					libFormatCount += 1;
				}
			});
		});

		return platformsToCheck.size > 1 && libFormatCount > 1;
	}
}
