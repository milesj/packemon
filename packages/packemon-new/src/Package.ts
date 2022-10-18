/* eslint-disable @typescript-eslint/member-ordering */
import glob from 'fast-glob';
import semver from 'semver';
import { Memoize, Path, toArray } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
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
import { loadTsconfigJson } from './helpers/loadTsconfigJson';
import { packemonBlueprint } from './schemas';
import { FeatureFlags, PackageConfig, PackemonPackage, PackemonPackageConfig } from './types';

export class Package {
	// readonly artifacts: Artifact[] = [];

	readonly configs: PackageConfig[] = [];

	readonly debug!: Debugger;

	readonly json: PackemonPackage;

	readonly jsonPath: Path;

	readonly path: Path;

	readonly workspaceRoot: Path;

	constructor(path: Path, contents: PackemonPackage, workspaceRoot: Path) {
		this.path = path;
		this.jsonPath = this.path.append('package.json');
		this.json = contents;
		this.workspaceRoot = workspaceRoot;
		this.debug = createDebugger(['packemon', 'package', this.getSlug()]);
	}

	async clean(): Promise<void> {
		this.debug('Cleaning build artifacts');

		// await Promise.all(this.artifacts.map((artifact) => artifact.cleanup()));
	}

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
			this.path.append('tsconfig.json') ||
			this.workspaceRoot.append('tsconfig.json')
		) {
			const tsConfig = loadTsconfigJson(this.path.append('tsconfig.json'));

			flags.typescript = Boolean(tsConfig);
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
			this.workspaceRoot.append('.flowconfig')
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
}
