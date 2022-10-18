import execa from 'execa';
import semver from 'semver';
import { Memoize, Path, PortablePath, Project as BaseProject } from '@boost/common';
import { getVersion } from './helpers/getVersion';
import { Package } from './Package';

export class Project extends BaseProject {
	async generateDeclarations(declarationConfig?: string, cwd?: PortablePath): Promise<unknown> {
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
			cwd: String(cwd ?? this.root),
			preferLocal: true,
		});

		if (!cwd) {
			this.buildPromise = promise;
		}

		return promise;
	}
}
