import fs from 'fs-extra';
import { isObject, json, Path, PortablePath, toArray } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Config } from './Config';
import { Package } from './Package';
import { PackageValidator } from './PackageValidator';
import { buildBlueprint, validateBlueprint } from './schemas';
import type { BuildOptions, FilterOptions, PackemonPackage, ValidateOptions } from './types';

export class Packemon {
	readonly config: Config = new Config('packemon');

	readonly debug: Debugger;

	readonly workingDir: Path;

	constructor(cwd: PortablePath = process.cwd()) {
		this.workingDir = Path.resolve(cwd);
		this.debug = createDebugger('packemon:core');

		this.debug('Running packemon in %s', this.workingDir);
	}

	async build(pkg: Package, baseOptions: BuildOptions) {
		this.debug('Starting `build` process');

		const options = optimal(buildBlueprint).validate(baseOptions);

		if (options.loadConfigs) {
			const { config } = await this.config.loadConfigFromBranchToRoot(pkg.path);

			await pkg.build(options, config);
		} else {
			await pkg.build(options, {});
		}
	}

	async clean(pkg: Package) {
		this.debug('Starting `clean` process');

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

		const pkgContents = json.parse<PackemonPackage>(await fs.readFile(pkgPath.path(), 'utf8'));

		if (skipPrivate && pkgContents.private) {
			this.debug('Package is private and `skipPrivate` has been provided');

			return null;
		}

		if (!pkgContents.packemon) {
			this.debug('No `packemon` configuration found for %s, skipping', pkgContents.name);

			return null;
		}

		if (!isObject(pkgContents.packemon) && !Array.isArray(pkgContents.packemon)) {
			throw new Error(
				`Invalid \`packemon\` configuration for ${pkgContents.name}, must be an object or array of objects.`,
			);
		}

		const pkg = new Package(this.workingDir, pkgContents, this.findWorkspaceRoot());

		pkg.setConfigs(toArray(pkgContents.packemon));

		return pkg;
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
			const pkg = json.parse<PackemonPackage>(fs.readFileSync(pkgPath.path(), 'utf8'));

			if (pkg.workspaces) {
				return dir;
			}
		}

		const parentDir = dir.parent();

		// This is a special case to handle our fixtures
		if (__TEST__ && parentDir.name() === '__fixtures__') {
			return dir;
		}

		const isRoot = parentDir.path();

		if (isRoot === '' || isRoot === '.' || isRoot === '/') {
			return dir; // Oops
		}

		return this.findWorkspaceRoot(parentDir);
	}
}
