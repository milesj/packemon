import os from 'os';
import React from 'react';
import { Arg, Config } from '@boost/cli';
import { AnalyzeType, BuildOptions, DeclarationType } from '../types';
import { BaseCommand } from './Base';

@Config('build', 'Build standardized packages for distribution')
export class BuildCommand extends BaseCommand<Required<BuildOptions>> {
	@Arg.Flag('Add `engine` versions to each `package.json`')
	addEngines: boolean = false;

	@Arg.Flag('Add `exports` fields to each `package.json`')
	addExports: boolean = false;

	@Arg.Flag('Add `files` whitelist to each `package.json`')
	addFiles: boolean = true;

	@Arg.String('Visualize and analyze all generated builds', {
		choices: ['none', 'sunburst', 'treemap', 'network'],
	})
	analyze: AnalyzeType = 'none';

	@Arg.Number('Number of builds to run in parallel')
	concurrency: number = os.cpus().length;

	@Arg.String('Generate TypeScript declarations for each package', {
		choices: ['none', 'standard', 'api'],
	})
	declaration: DeclarationType = 'none';

	@Arg.String('Path to a custom `tsconfig` for declaration building')
	declarationConfig: string = 'tsconfig.json';

	@Arg.Number('Timeout in milliseconds before a build is cancelled')
	timeout: number = 0;

	async run() {
		const { Build } = await import('../components/Build');

		return (
			<Build
				addEngines={this.addEngines}
				addExports={this.addExports}
				addFiles={this.addFiles}
				analyze={this.analyze}
				concurrency={this.concurrency}
				declaration={this.declaration}
				declarationConfig={this.declarationConfig}
				filter={this.filter}
				filterFormats={this.formats}
				filterPlatforms={this.platforms}
				packemon={this.packemon}
				quiet={this.quiet}
				skipPrivate={this.skipPrivate}
				timeout={this.timeout}
			/>
		);
	}
}
