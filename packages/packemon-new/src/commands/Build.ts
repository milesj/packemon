import os from 'os';
import fileSize from 'filesize';
import { applyMarkdown, applyStyle, Arg, Config } from '@boost/cli';
import { formatMs } from '@boost/common';
import { figures } from '@boost/terminal';
import { STATE_COLORS } from '../constants';
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

	@Arg.String('Path to a custom `tsconfig` for declaration building')
	declarationConfig: string = 'tsconfig.json';

	@Arg.Number('Timeout in milliseconds before a build is cancelled')
	timeout: number = 0;

	@Arg.Flag('Stamp all `package.json`s with a release timestamp')
	stamp: boolean = false;

	async run() {
		const pkg = await this.packemon.build({
			addEngines: this.addEngines,
			addExports: this.addExports,
			addFiles: this.addFiles,
			concurrency: this.concurrency,
			declaration: this.declaration,
			declarationConfig: this.declarationConfig,
			filterFormats: this.formats,
			filterPlatforms: this.platforms,
			loadConfigs: this.loadConfigs,
			quiet: this.quiet,
			skipPrivate: this.skipPrivate,
			stamp: this.stamp,
			timeout: this.timeout,
		});

		if (!pkg) {
			return;
		}

		const output = [applyMarkdown(`**${pkg.getName()}**`)];

		pkg.artifacts.forEach((artifact) => {
			const row: string[] = [];

			artifact.builds.forEach((build, index) => {
				const icon = artifact.state === 'failed' ? figures.cross : figures.squareSmallFilled;

				row.push(
					applyStyle(
						applyMarkdown(`**${icon} ${build.format}**`),
						STATE_COLORS[artifact.state] ?? 'default',
					),
				);

				const { stats } = artifact.builds[index];

				if (stats) {
					row.push(applyStyle(`(${fileSize(stats.size)})`, 'muted'));
				}
			});

			if (artifact.buildResult.time <= 100) {
				row.push(applyStyle('~', 'muted'));
			} else {
				row.push(formatMs(artifact.buildResult.time));
			}

			output.push(row.join(' '));
		});

		this.log(output.join('\n'));
	}
}
