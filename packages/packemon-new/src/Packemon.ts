import fs from 'fs-extra';
import { isObject, json, Path, PortablePath, toArray } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Context, PooledPipeline } from '@boost/pipeline';
import { Config } from './Config';
import { Package } from './Package';
import { PackageValidator } from './PackageValidator';
import { buildBlueprint, validateBlueprint } from './schemas';
import type { BuildOptions, FilterOptions, PackemonPackage, ValidateOptions } from './types';

export class Packemon {
	readonly config: Config = new Config('packemon');

	readonly debug: Debugger;

	readonly workingDir: Path;

	readonly workspaceRoot: Path;

	constructor(cwd: PortablePath = process.cwd()) {
		this.workingDir = Path.resolve(cwd);
		this.workspaceRoot = this.findWorkspaceRoot(this.workingDir);
		this.debug = createDebugger('packemon:core');

		this.debug('Initializing packemon in project %s', this.workingDir);
	}

	async build(baseOptions: BuildOptions) {
		this.debug('Starting `build` process');

		const options = optimal(buildBlueprint).validate(baseOptions);
		const pkg = await this.loadPackage(options);

		if (!pkg) {
			console.log('No package found to build.');
			return;
		}

		// Build packages in parallel using a pool
		const pipeline = new PooledPipeline(new Context());

		pipeline.configure({
			concurrency: options.concurrency,
			timeout: options.timeout,
		});

		pipeline.add(pkg.getName(), async () => {
			if (options.loadConfigs) {
				const { config } = await this.config.loadConfigFromBranchToRoot(pkg.path);

				await pkg.build(options, config);
			} else {
				await pkg.build(options, {});
			}
		});

		const { errors } = await pipeline.run();

		// Throw to trigger an error screen in the terminal
		if (errors.length > 0) {
			throw errors[0];
		}
	}

	async clean() {
		this.debug('Starting `clean` process');

		const pkg = await this.loadPackage();

		if (pkg) {
			await pkg.clean();
		}
	}

	/**
	 * Find and load the package that has been configured with a `packemon`
	 * block in the `package.json`. Once loaded, validate the configuration.
	 */
	async loadPackage({ skipPrivate }: FilterOptions = {}): Promise<Package | null> {
		this.debug('Loading package from %s', this.workingDir);

		const pkgPath = this.workingDir.append('package.json');

		if (pkgPath.exists()) {
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

		const pkg = new Package(this.workingDir, pkgContents, this.workspaceRoot);

		pkg.setConfigs(toArray(pkgContents.packemon));

		return pkg;
	}

	async validate(baseOptions: Partial<ValidateOptions>): Promise<PackageValidator | null> {
		this.debug('Starting `validate` process');

		const options = optimal(validateBlueprint).validate(baseOptions);
		const pkg = await this.loadPackage(options);

		if (pkg) {
			return new PackageValidator(pkg).validate(options);
		}

		return null;
	}

	/**
	 * Determine the workspace root when running in a monorepo.
	 * This is necessary as it changes functionality.
	 */
	protected findWorkspaceRoot(dir: Path): Path {
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
