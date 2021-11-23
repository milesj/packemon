/* eslint-disable @typescript-eslint/member-ordering */

import execa from 'execa';
import semver from 'semver';
import { Memoize, Path, Project as BaseProject, VirtualPath } from '@boost/common';
import { getVersion } from './helpers/getVersion';
import { Package } from './Package';
import { DeclarationType } from './types';

export class Project extends BaseProject {
	workspaces: string[] = [];

	private buildPromise?: Promise<unknown>;

	checkEngineVersionConstraint() {
		let version = '';

		try {
			version = getVersion();
		} catch {
			return;
		}

		const versionConstraint = this.rootPackage.packageJson.engines?.packemon;

		if (version && versionConstraint && !semver.satisfies(version, versionConstraint)) {
			throw new Error(
				`Project requires a packemon version compatible with ${versionConstraint}, found ${version}.`,
			);
		}
	}

	@Memoize()
	isLernaManaged(): boolean {
		return this.isWorkspacesEnabled() && this.root.append('lerna.json').exists();
	}

	isWorkspacesEnabled(): boolean {
		return this.workspaces.length > 0;
	}

	async generateDeclarations(
		declarationType: DeclarationType,
		pkgPath?: Path,
		declarationConfig?: string,
	): Promise<unknown> {
		if (this.buildPromise) {
			return this.buildPromise;
		}

		const args: string[] = [];
		const isNonStandardTsConfig = declarationConfig && declarationConfig !== 'tsconfig.json';
		let persistBuild = false;

		if (this.isWorkspacesEnabled()) {
			args.push('--build');

			// Since we collapse all DTS into a single file,
			// we need to force build to overwrite the types,
			// since they're not what the TS build expects.
			if (declarationType) {
				// TODO: This seems to always be required??
				args.push('--force');
			}

			// Only build the specific project when applicable
			if (pkgPath) {
				let projectPath = this.root.relativeTo(pkgPath);

				if (isNonStandardTsConfig) {
					projectPath = projectPath.append(declarationConfig);
				}

				args.push(new VirtualPath(projectPath).path());

				// Persist when we're building the entire monorepo,
				// otherwise we'll have overlapping builds!
			} else {
				persistBuild = true;
			}
		} else {
			args.push(
				'--declaration',
				'--declarationDir',
				'dts',
				'--declarationMap',
				'--emitDeclarationOnly',
			);

			// This options isn't supported with project references
			if (isNonStandardTsConfig) {
				args.push('--project', declarationConfig);
			}

			persistBuild = true;
		}

		// Store the promise so parallel artifacts can rely on the same build
		const promise = execa('tsc', args, {
			cwd: this.root.path(),
			preferLocal: true,
		});

		if (persistBuild) {
			this.buildPromise = promise;
		}

		return promise;
	}

	@Memoize()
	getWorkspacePackageNames(): string[] {
		return this.getWorkspacePackages().map((wp) => wp.package.name);
	}

	@Memoize()
	get rootPackage(): Package {
		const pkg = new Package(this, this.root, this.getPackage());
		pkg.root = true;

		return pkg;
	}
}
