import os from 'node:os';
import { applyMarkdown, applyStyle, Arg, Config } from '@boost/cli';
import { formatMs } from '@boost/common';
import { figures } from '@boost/terminal';
import { STATE_COLORS } from '../constants';
import { Package } from '../Package';
import { BuildOptions } from '../types';
import { BaseCommand } from './Base';

@Config('build', 'Build standardized packages for distribution')
export class BuildCommand extends BaseCommand<Required<BuildOptions>> {
	@Arg.Flag('Add `engine` versions to each `package.json`')
	addEngines: boolean = false;

	@Arg.Flag('Add `exports` fields to each `package.json`')
	addExports: boolean = false;

	@Arg.Flag('Add `files` whitelist to each `package.json`')
	addFiles: boolean = true;

	@Arg.Number('Number of builds to run in parallel')
	concurrency: number = os.cpus().length;

	@Arg.Flag('Generate TypeScript declarations for each package')
	declaration: boolean = false;

	@Arg.Number('Timeout in milliseconds before a build is cancelled')
	timeout: number = 0;

	@Arg.Flag('Stamp all `package.json`s with a release timestamp')
	stamp: boolean = false;

	async run() {
		return this.build(await this.getPackage());
	}

	protected async build(pkg: Package) {
		await this.packemon.build(pkg, {
			addEngines: this.addEngines,
			addExports: this.addExports,
			addFiles: this.addFiles,
			concurrency: this.concurrency,
			declaration: this.declaration,
			filterFormats: this.formats,
			filterPlatforms: this.platforms,
			loadConfigs: this.loadConfigs,
			quiet: this.quiet,
			skipPrivate: this.skipPrivate,
			stamp: this.stamp,
			timeout: this.timeout,
		});

		const output = [applyMarkdown(`**${pkg.getName()}**`)];
		const { filesize } = await import('filesize');

		pkg.artifacts.forEach((artifact) => {
			const row: string[] = [' '];

			artifact.builds.forEach((build, index) => {
				const icon = artifact.state === 'failed' ? figures.cross : figures.squareSmallFilled;

				const create = (tag: string) =>
					applyStyle(
						applyMarkdown(`**${icon} ${tag}**`),
						STATE_COLORS[artifact.state] ?? 'default',
					);

				row.push(create(build.format));

				const { stats } = artifact.builds[index];

				if (stats) {
					row.push(applyStyle(`(${String(filesize(stats.size))})`, 'muted'));
				}

				if (build.declaration) {
					row.push(create('dts'));
				}
			});

			if (artifact.buildResult.time <= 100) {
				row.push(applyStyle('~', 'muted'));
			} else {
				row.push(formatMs(artifact.buildResult.time));
			}

			output.push(row.join(' '));
		});

		output.push('\n');

		this.log(output.join('\n').trim());
	}

	protected async pack(pkg: Package) {
		await this.packemon.clean(pkg);

		await this.build(pkg);

		const validator = await this.packemon.validate(pkg, {});

		this.renderValidator(validator);
	}
}
