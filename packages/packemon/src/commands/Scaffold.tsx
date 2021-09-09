/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable react/jsx-no-bind */

import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import glob from 'fast-glob';
import { Arg, Command, Config } from '@boost/cli';
import { Template } from '../types';

@Config('scaffold', 'Scaffold packages with ease')
export class ScaffoldCommand extends Command {
	@Arg.Params({
		label: 'Dest',
		description: 'Destination to copy template to',
		type: 'string',
		required: true,
	})
	async run(dest: string) {
		const destDir = path.join(process.cwd(), dest);
		let template: Template = 'monorepo';

		// Choose template
		const { TemplateSelect } = await import('../components/Scaffold/TemplateSelect');
		await this.render(
			<TemplateSelect
				onSelect={(value) => {
					template = value;
				}}
			/>,
		);

		console.log(template);
		console.log(await this.loadFilesFromTemplate(template));
	}

	async loadFilesFromTemplate(template: string) {
		const templateDir = new URL(`../../templates/${template}`, import.meta.url);

		return glob('**/*', {
			absolute: true,
			// @ts-expect-error URL type mismatch
			cwd: fileURLToPath(templateDir),
		});
	}
}
