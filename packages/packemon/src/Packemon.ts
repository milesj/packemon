/* eslint-disable @typescript-eslint/member-ordering */

import fs from 'fs-extra';
import rimraf from 'rimraf';
import {
	isObject,
	json,
	Memoize,
	Path,
	PortablePath,
	toArray,
	VirtualPath,
	WorkspacePackage,
} from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import { Context, PooledPipeline } from '@boost/pipeline';
import { CodeArtifact } from './CodeArtifact';
import { Config } from './Config';
import { matchesPattern } from './helpers/matchesPattern';
import { Package } from './Package';
import { PackageValidator } from './PackageValidator';
import { Project } from './Project';
import { buildBlueprint, validateBlueprint } from './schemas';
import type {
	ApiType,
	BuildOptions,
	FilterOptions,
	PackemonPackage,
	Platform,
	TypesBuild,
	ValidateOptions,
} from './types';
import { TypesArtifact } from './TypesArtifact';

export class Packemon {
	readonly config: Config = new Config('packemon');

	readonly debug: Debugger;

	readonly onPackageBuilt = new Event<[Package]>('package-built');

	readonly onPackagesLoaded = new Event<[Package[]]>('packages-loaded');

	readonly project: Project;

	readonly root: Path;

	readonly workingDir: Path;

	constructor(cwd: PortablePath = process.cwd()) {
		this.workingDir = Path.resolve(cwd);
		this.root = this.findWorkspaceRoot(this.workingDir) ?? this.workingDir;
		this.project = new Project(this.root, this.workingDir);
		this.debug = createDebugger('packemon:core');

		this.debug('Initializing packemon in project %s', this.root);

		this.project.checkEngineVersionConstraint();

		// Not sure which approach is better here? Build systems run packemon
		// from the package folder itself, bypasing the "workspace" logic and the root,
		// but non-build systems run from the root...
		this.config.setRootDir(this.workingDir);
	}

	async build(baseOptions: BuildOptions) {
		this.debug('Starting `build` process');

		const options = optimal(buildBlueprint).validate(baseOptions);
		let packages = await this.loadConfiguredPackages(options);

		packages = this.generateArtifacts(packages, options);

		if (packages.length === 0) {
			throw new Error('No packages to build.');
		}

		// Build packages in parallel using a pool
		const pipeline = new PooledPipeline(new Context());

		pipeline.configure({
			concurrency: options.concurrency,
			timeout: options.timeout,
		});

		packages.forEach((pkg) => {
			pipeline.add(pkg.getName(), async () => {
				if (options.loadConfigs) {
					const { config } = await this.config.loadConfigFromBranchToRoot(pkg.path);

					await pkg.build(options, config);
				} else {
					await pkg.build(options, {});
				}

				this.onPackageBuilt.emit([pkg]);
			});
		});

		const { errors } = await pipeline.run();

		// Always cleanup whether a successful or failed build
		await this.cleanTemporaryFiles(packages);

		// Throw to trigger an error screen in the terminal
		if (errors.length > 0) {
			throw errors[0];
		}
	}

	async clean() {
		this.debug('Starting `clean` process');

		const packages = await this.loadConfiguredPackages();

		// Clean package specific files
		await this.cleanTemporaryFiles(packages);

		// Clean build formats
		const formatFolders = '{assets,cjs,dts,esm,lib,mjs,umd}';
		const pathsToRemove: string[] = [];

		if (this.project.isWorkspacesEnabled()) {
			this.project.workspaces.forEach((ws) => {
				pathsToRemove.push(new VirtualPath(ws, formatFolders).path());
			});
		} else {
			pathsToRemove.push(`./${formatFolders}`);
		}

		await Promise.all(
			pathsToRemove.map(
				(rfPath) =>
					new Promise((resolve, reject) => {
						this.debug(' - %s', rfPath);

						rimraf(rfPath, (error) => {
							if (error) {
								reject(error);
							} else {
								resolve(undefined);
							}
						});
					}),
			),
		);
	}

	async validate(baseOptions: Partial<ValidateOptions>): Promise<PackageValidator[]> {
		this.debug('Starting `validate` process');

		const options = optimal(validateBlueprint).validate(baseOptions);
		const packages = await this.loadConfiguredPackages(options);

		return Promise.all(packages.map((pkg) => new PackageValidator(pkg).validate(options)));
	}

	/**
	 * Find all packages within a project. If using workspaces, return a list of packages
	 * from each workspace glob. If not using workspaces, assume project is a package.
	 */
	async findPackagesInProject({ filter, skipPrivate }: FilterOptions = {}) {
		this.debug('Finding packages in project');

		const pkgPaths: Path[] = [];

		this.project.workspaces = this.project.getWorkspaceGlobs({ relative: true });

		// Multi package repo
		if (this.project.workspaces.length > 0) {
			this.debug('Workspaces enabled, finding packages using globs');

			this.project.getWorkspacePackagePaths().forEach((filePath) => {
				pkgPaths.push(Path.create(filePath).append('package.json'));
			});

			// Single package repo
		} else {
			this.debug('Not workspaces enabled, using root as package');

			pkgPaths.push(this.root.append('package.json'));
		}

		this.debug('Found %d package(s)', pkgPaths.length);

		let packages: WorkspacePackage<PackemonPackage>[] = await Promise.all(
			pkgPaths.map(async (pkgPath) => {
				const contents = json.parse<PackemonPackage>(await fs.readFile(pkgPath.path(), 'utf8'));

				this.debug(
					' - %s: %s',
					contents.name,
					pkgPath.path().replace(this.root.path(), '').replace('package.json', ''),
				);

				return {
					metadata: this.project.createWorkspaceMetadata(pkgPath),
					package: contents,
				};
			}),
		);

		// Skip `private` packages
		if (skipPrivate) {
			const privatePackageNames: string[] = [];

			packages = packages.filter((pkg) => {
				if (pkg.package.private) {
					privatePackageNames.push(pkg.package.name);

					return false;
				}

				return true;
			});

			this.debug('Filtering private packages: %s', privatePackageNames.join(', '));
		}

		// Filter packages based on a pattern
		if (filter) {
			const filteredPackageNames: string[] = [];

			packages = packages.filter((pkg) => {
				const { name } = pkg.package;

				if (!matchesPattern(name, filter)) {
					filteredPackageNames.push(name);

					return false;
				}

				return true;
			});

			this.debug('Filtering packages with pattern %s: %s', filter, filteredPackageNames.join(', '));
		}

		// Error if no packages are found
		if (packages.length === 0) {
			throw new Error('No packages found in project.');
		}

		return packages;
	}

	/**
	 * Generate build and optional types artifacts for each package in the list.
	 */
	generateArtifacts(
		packages: Package[],
		{ declaration, filterFormats, filterPlatforms }: BuildOptions = {},
	): Package[] {
		this.debug('Generating artifacts for packages');

		packages.forEach((pkg) => {
			const typesBuilds: Record<string, TypesBuild> = {};
			const sharedLib = this.requiresSharedLib(pkg);
			const apiType = this.determineApiType(pkg);

			pkg.configs.forEach((config, index) => {
				let builds = config.formats.map((format) => ({
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

				const artifact = new CodeArtifact(pkg, builds);
				artifact.api = apiType;
				artifact.bundle = config.bundle;
				artifact.configGroup = index;
				artifact.externals = config.externals;
				artifact.inputs = config.inputs;
				artifact.namespace = config.namespace;
				artifact.platform = config.platform;
				artifact.sharedLib = sharedLib;
				artifact.support = config.support;

				pkg.addArtifact(artifact);

				Object.entries(config.inputs).forEach(([outputName, inputFile]) => {
					typesBuilds[outputName] = { inputFile, outputName };
				});
			});

			if (declaration) {
				const artifact = new TypesArtifact(pkg, Object.values(typesBuilds));
				artifact.api = apiType;
				artifact.bundle = pkg.configs.some((config) => config.bundle);

				pkg.addArtifact(artifact);
			}

			this.debug(' - %s: %s', pkg.getName(), pkg.artifacts.join(', '));
		});

		// Remove packages that have no artifacts
		return packages.filter((pkg) => pkg.artifacts.length > 0);
	}

	/**
	 * Find and load all packages that have been configured with a `packemon`
	 * block in their `package.json`. Once loaded, validate the configuration.
	 */
	@Memoize()
	async loadConfiguredPackages(options?: FilterOptions): Promise<Package[]> {
		const packages = this.validateAndPreparePackages(await this.findPackagesInProject(options));

		this.onPackagesLoaded.emit([packages]);

		return packages;
	}

	/**
	 * Cleanup all package and artifact related files in all packages.
	 */
	protected async cleanTemporaryFiles(packages: Package[]) {
		this.debug('Cleaning temporary build files');

		await Promise.all(packages.map((pkg) => pkg.cleanup()));
	}

	/**
	 * When 1 config needs a private API, all other configs should be private,
	 * otherwise we will have conflicting output structures and exports.
	 */
	protected determineApiType(pkg: Package): ApiType {
		return pkg.configs.some((cfg) => cfg.api === 'private') ? 'private' : 'public';
	}

	/**
	 * Determine the workspace root when running in a monorepo.
	 * This is necessary as it changes functionality.
	 */
	protected findWorkspaceRoot(dir: Path): Path | undefined {
		const pkgPath = dir.append('package.json');

		if (pkgPath.exists()) {
			const pkg = json.parse<PackemonPackage>(fs.readFileSync(pkgPath.path(), 'utf8'));

			if (pkg.workspaces) {
				return dir;
			}
		}

		const parentDir = dir.parent();
		const isRoot = parentDir.path();

		if (isRoot === '' || isRoot === '.' || isRoot === '/') {
			return undefined;
		}

		return this.findWorkspaceRoot(parentDir);
	}

	/**
	 * Format "lib" is a shared format across all platforms,
	 * and when a package wants to support multiple platforms,
	 * we must account for this and alter the output paths.
	 */
	protected requiresSharedLib(pkg: Package): boolean {
		const platformsToCheck = new Set<Platform>();
		let libFormatCount = 0;

		pkg.configs.forEach((config) => {
			platformsToCheck.add(config.platform);

			config.formats.forEach((format) => {
				if (format === 'lib') {
					libFormatCount += 1;
				}
			});
		});

		return platformsToCheck.size > 1 && libFormatCount > 1;
	}

	/**
	 * Validate that every loaded package has a valid `packemon` configuration,
	 * otherwise skip it. All valid packages will return a `Package` instance.
	 */
	protected validateAndPreparePackages(packages: WorkspacePackage<PackemonPackage>[]): Package[] {
		this.debug('Validating found packages');

		const nextPackages: Package[] = [];

		packages.forEach(({ metadata, package: contents }) => {
			if (!contents.packemon) {
				this.debug('No `packemon` configuration found for %s, skipping', contents.name);

				return;
			}

			if (!isObject(contents.packemon) && !Array.isArray(contents.packemon)) {
				this.debug(
					'Invalid `packemon` configuration for %s, must be an object or array of objects',
					contents.name,
				);

				return;
			}

			const pkg = new Package(this.project, Path.create(metadata.packagePath), contents);

			pkg.setConfigs(toArray(contents.packemon));

			nextPackages.push(pkg);
		});

		return nextPackages;
	}
}
