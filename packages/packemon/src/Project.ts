/* eslint-disable @typescript-eslint/member-ordering */

import execa from 'execa';
import semver from 'semver';
import { Memoize, Project as BaseProject } from '@boost/common';
import { getVersion } from './helpers/getVersion';
import { Package } from './Package';

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

	async generateDeclarations(declarationConfig?: string): Promise<unknown> {
		if (this.buildPromise) {
			return this.buildPromise;
		}

		const args: string[] = [];

		if (this.isWorkspacesEnabled()) {
			args.push(
				'--build',
				// Since we collapse all DTS into a single file,
				// we need to force build to overwrite the types,
				// since they're not what the TS build expects.
				'--force',
			);
		} else {
			args.push(
				'--declaration',
				'--declarationDir',
				'dts',
				'--declarationMap',
				'--emitDeclarationOnly',
			);

			// This options isnt supported with project references
			if (declarationConfig) {
				args.push('--project', declarationConfig);
			}
		}

		// Store the promise so parallel artifacts can rely on the same build
		this.buildPromise = execa('tsc', args, {
			cwd: this.root.path(),
			preferLocal: true,
		});

		return this.buildPromise;
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
