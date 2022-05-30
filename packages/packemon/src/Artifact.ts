import fs from 'fs-extra';
import { applyStyle } from '@boost/cli';
import { Path, PortablePath } from '@boost/common';
import type { Package } from './Package';
import type {
	ApiType,
	ArtifactState,
	Awaitable,
	BuildOptions,
	BuildResult,
	ConfigFile,
	PackageExports,
} from './types';

export abstract class Artifact<T extends object = {}> {
	api: ApiType = 'private';

	bundle: boolean = true;

	readonly builds: T[] = [];

	readonly buildResult: BuildResult = { files: [], time: 0 };

	readonly package: Package;

	state: ArtifactState = 'pending';

	constructor(pkg: Package, builds: T[]) {
		this.package = pkg;
		this.builds = builds;
	}

	cleanup(): Awaitable {}

	isComplete(): boolean {
		return this.state === 'passed' || this.state === 'failed';
	}

	isRunning(): boolean {
		return this.state === 'building';
	}

	startup() {}

	toString(): string {
		return this.getLabel();
	}

	protected logWithSource(
		message: string,
		level: 'error' | 'info' | 'warn',
		{
			id,
			output,
			sourceColumn,
			sourceFile,
			sourceLine,
		}: {
			id?: string;
			output?: string;
			sourceColumn?: number;
			sourceFile?: string;
			sourceLine?: number;
		} = {},
	) {
		let msg = `[${this.package.getName()}${output ? `:${output}` : ''}] ${message}`;

		const meta: string[] = [];

		if (id) {
			meta.push(`id=${id}`);
		}

		if (sourceFile) {
			meta.push(
				`file=${new Path(sourceFile)
					.path()
					.replace(this.package.project.root.path(), '')
					.slice(1)}`,
			);
		}

		if (sourceLine || sourceColumn) {
			meta.push(`line=${sourceLine ?? '?'}:${sourceColumn ?? '?'}`);
		}

		if (meta.length > 0) {
			msg += applyStyle(` (${meta.join(' ')})`, 'muted');
		}

		console[level](msg);
	}

	protected async removeFiles(files: PortablePath[]): Promise<unknown> {
		return Promise.all(files.map((file) => fs.remove(String(file))));
	}

	abstract build(options: BuildOptions, packemonConfig: ConfigFile): Awaitable;

	abstract getLabel(): string;

	abstract getBuildTargets(): string[];

	abstract getPackageExports(): PackageExports;
}
