/* eslint-disable @typescript-eslint/member-ordering */

import execa from 'execa';
import semver from 'semver';
import { Memoize, Path, PortablePath, Project as BaseProject } from '@boost/common';
import { getVersion } from './helpers/getVersion';
import { Package } from './Package';

export class Project extends BaseProject {
	readonly workingDir: Path;

	workspaces: string[] = [];

	private buildPromise?: Promise<unknown>;

	constructor(root: PortablePath, cwd?: Path) {
		super(root);

		this.workingDir = cwd ?? this.root;
	}

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

	isRunningInWorkspaceRoot(): boolean {
		return this.root.equals(this.workingDir);
	}

	async generateDeclarations(declarationConfig?: string): Promise<unknown> {
		if (this.buildPromise) {
			return this.buildPromise;
		}

		const args: string[] = [
			'--declaration',
			'--declarationDir',
			'dts',
			'--declarationMap',
			'--emitDeclarationOnly',
		];

		if (declarationConfig && declarationConfig !== 'tsconfig.json') {
			args.push('--project', declarationConfig);
		}

		// Store the promise so parallel artifacts can rely on the same build
		const promise = execa('tsc', args, {
			cwd: this.root.path(),
			preferLocal: true,
		});

		this.buildPromise = promise;

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
