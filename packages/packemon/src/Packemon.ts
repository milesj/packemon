import { json, Path, PortablePath, Project } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Config } from './Config';
import { FileSystem, nodeFileSystem } from './FileSystem';
import { matchesPattern } from './helpers/matchesPattern';
import { Package } from './Package';
import { PackageValidator } from './PackageValidator';
import { buildBlueprint, validateBlueprint } from './schemas';
import type { BuildOptions, FilterOptions, PackemonPackage, ValidateOptions } from './types';

export class Packemon {
	readonly config: Config = new Config('packemon');

	readonly debug: Debugger;

	readonly fs: FileSystem = nodeFileSystem;

	readonly workingDir: Path;

	constructor(cwd: PortablePath = process.cwd()) {
		this.workingDir = Path.resolve(cwd);
		this.debug = createDebugger('packemon:core');

		this.debug('Running packemon in %s', this.workingDir);
	}

	async build(pkg: Package, baseOptions: BuildOptions) {
		this.debug('Starting `build` process');

		const options = optimal(buildBlueprint).validate(baseOptions);

		pkg.generateArtifacts(options);

		if (options.loadConfigs) {
			const { config } = await this.config.loadConfigFromBranchToRoot(pkg.path);

			await pkg.build(options, config);
		} else {
			await pkg.build(options, {});
		}
	}

	async clean(pkg: Package) {
		this.debug('Starting `clean` process');

		pkg.generateArtifacts({});

		await pkg.clean();
	}

	async validate(pkg: Package, baseOptions: Partial<ValidateOptions>): Promise<PackageValidator> {
		this.debug('Starting `validate` process');

		const options = optimal(validateBlueprint).validate(baseOptions);

		return new PackageValidator(pkg).validate(options);
	}

	/**
	 * Find and load the package that has been configured with a `packemon`
	 * block in the `package.json`. Once loaded, validate the configuration.
	 */
	async findPackage({ skipPrivate }: FilterOptions = {}): Promise<Package | null> {
		this.debug('Finding package in %s', this.workingDir);

		const pkgPath = this.workingDir.append('package.json');

		if (!pkgPath.exists()) {
			throw new Error(`No \`package.json\` found in ${this.workingDir}.`);
		}

		const pkgContents = json.parse<PackemonPackage>(await this.fs.readFile(pkgPath.path()));

		if (skipPrivate && pkgContents.private) {
			this.debug('Package is private and `skipPrivate` has been provided');

			return null;
		}

		if (!pkgContents.packemon) {
			this.debug('No `packemon` configuration found for %s, skipping', pkgContents.name);

			return null;
		}

		return new Package(this.workingDir, pkgContents, await this.findWorkspaceRoot());
	}

	/**
	 * Find all packages within a project. If using workspaces, return a list of packages
	 * from each workspace glob. If not using workspaces, assume project is a package.
	 */
	async findPackages({ filter, skipPrivate }: FilterOptions = {}): Promise<Package[]> {
		this.debug('Finding packages in project');

		const workspaceRoot = await this.findWorkspaceRoot();
		const project = new Project(workspaceRoot);
		const workspaces = project.getWorkspaceGlobs({ relative: true });

		if (workspaces.length === 0) {
			throw new Error('No `workspaces` defined in root `package.json`.');
		}

		const pkgPaths = project
			.getWorkspacePackagePaths()
			.map((filePath) => Path.create(filePath).append('package.json'));

		this.debug('Found %d package(s)', pkgPaths.length);

		let packages: Package[] = [];

		await Promise.all(
			pkgPaths.map(async (pkgPath) => {
				if (!pkgPath.exists()) {
					return;
				}

				const contents = json.parse<PackemonPackage>(await this.fs.readFile(pkgPath.path()));

				if (contents.packemon) {
					this.debug(' - %s (%s)', contents.name, pkgPath.path());

					packages.push(new Package(pkgPath.parent(), contents, workspaceRoot));
				} else {
					this.debug('No `packemon` configuration found for %s, skipping', contents.name);
				}
			}),
		);

		// Skip `private` packages
		if (skipPrivate) {
			const privatePackageNames: string[] = [];

			packages = packages.filter((pkg) => {
				if (pkg.json.private) {
					privatePackageNames.push(pkg.getName());

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
				const name = pkg.getName();

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
	 * Determine the workspace root when running in a monorepo.
	 * This is necessary as it changes functionality.
	 */
	// eslint-disable-next-line complexity
	findWorkspaceRoot(startingDir?: Path): Path {
		const dir = startingDir ?? this.workingDir;

		if (
			dir.append('yarn.lock').exists() ||
			dir.append('package-lock.json').exists() ||
			dir.append('pnpm-lock.yaml').exists()
		) {
			return dir;
		}

		const pkgPath = dir.append('package.json');

		if (pkgPath.exists()) {
			const pkg = this.fs.readJson<PackemonPackage>(pkgPath.path());

			if (pkg.workspaces) {
				return dir;
			}
		}

		const parentDir = dir.parent();

		// This is a special case to handle our fixtures
		if (process.env.NODE_ENV === 'test' && parentDir.name() === '__fixtures__') {
			return dir;
		}

		const isRoot = parentDir.path();

		if (isRoot === '' || isRoot === '.' || isRoot === '/') {
			return dir; // Oops
		}

		return this.findWorkspaceRoot(parentDir);
	}
}
