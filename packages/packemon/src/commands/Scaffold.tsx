/* eslint-disable react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import glob from 'fast-glob';
import { Arg, Command, Config } from '@boost/cli';
import { ScaffoldParams } from '../types';

@Config('scaffold', 'Scaffold projects and packages with ease')
export class ScaffoldCommand extends Command {
	destDir: string = '';

	@Arg.Params({
		label: 'dest',
		description: 'Destination to copy template to',
		type: 'string',
		required: true,
	})
	async run(dest: string) {
		this.destDir = path.join(process.cwd(), dest);

		const { Scaffold } = await import('../components/Scaffold');

		return <Scaffold onComplete={(params) => this.scaffold(params)} />;
	}

	async scaffold(params: ScaffoldParams) {
		console.log(params, this.destDir);

		switch (params.template) {
			default:
			case 'monorepo':
				return this.scaffoldMonorepo(params);
			case 'monorepo-package':
				return this.scaffoldMonorepo(params);
			case 'polyrepo':
				return this.scaffoldPolyrepo(params);
			case 'polyrepo-package':
				return this.scaffoldPolyrepo(params);
		}
	}

	async scaffoldBase(params: ScaffoldParams) {
		await this.copyFilesFromTemplate('base', this.destDir, params);
	}

	async scaffoldMonorepo(params: ScaffoldParams) {
		await this.scaffoldBase(params);
		await this.copyFilesFromTemplate('monorepo', this.destDir, params);
		await fs.promises.mkdir(path.join(this.destDir, 'packages'));
	}

	async scaffoldPolyrepo(params: ScaffoldParams) {
		await this.scaffoldBase(params);
		await this.copyFilesFromTemplate('polyrepo', this.destDir, params);
	}

	async copyFile(from: string, to: string, params: ScaffoldParams) {
		if (fs.existsSync(to)) {
			return;
		}

		const dir = path.dirname(from);

		if (!fs.existsSync(dir)) {
			await fs.promises.mkdir(dir, { recursive: true });
		}

		let content = await fs.promises.readFile(from, 'utf8');

		Object.entries(params).forEach(([key, value]) => {
			content = content.replace(new RegExp(`<${key}>`, 'g'), String(value));
		});

		await fs.promises.writeFile(to, content, 'utf8');
	}

	async copyFilesFromTemplate(template: string, destDir: string, params: ScaffoldParams) {
		// @ts-expect-error URL type mismatch
		const templateDir = fileURLToPath(new URL(`../../templates/${template}`, import.meta.url));
		const files = await glob('**/*', {
			absolute: false,
			dot: true,
			cwd: templateDir,
		});

		return Promise.all(
			files.map((file) =>
				this.copyFile(path.join(templateDir, file), path.join(destDir, file), params),
			),
		);
	}
}
