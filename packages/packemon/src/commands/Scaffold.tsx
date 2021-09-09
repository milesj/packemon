/* eslint-disable react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop */

import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import glob from 'fast-glob';
import fs from 'fs-extra';
import { Arg, Command, Config } from '@boost/cli';
import { json } from '@boost/common';
import { ScaffoldParams } from '../types';

@Config('scaffold', 'Scaffold projects and packages with ease')
export class ScaffoldCommand extends Command {
	@Arg.Flag('Overwrite files if they already exist', { short: 'f' })
	force: boolean = false;

	@Arg.Flag('Skip installation of npm dependencies')
	skipInstall: boolean = false;

	dest: string = '';

	destDir: string = '';

	@Arg.Params({
		label: 'dest',
		description: 'Destination to copy template to',
		type: 'string',
		required: true,
	})
	async run(dest: string) {
		this.dest = dest;
		this.destDir = path.join(process.cwd(), dest);

		const { Scaffold } = await import('../components/Scaffold');

		return <Scaffold onComplete={(params) => this.scaffold(params)} />;
	}

	async scaffold(params: ScaffoldParams) {
		switch (params.template) {
			default:
			case 'monorepo':
				return this.scaffoldMonorepo(params);
			case 'monorepo-package':
				return this.scaffoldMonorepoPackage(params);
			case 'polyrepo':
				return this.scaffoldPolyrepo(params);
			case 'polyrepo-package':
				return this.scaffoldPolyrepoPackage(params);
		}
	}

	async scaffoldMonorepo(params: ScaffoldParams) {
		await this.checkExistingInfrastructure('monorepo');
		await this.copyFilesFromTemplate('base', this.destDir, params);
		await this.copyFilesFromTemplate('monorepo', this.destDir, params);
		await this.installDependencies();

		try {
			await fs.mkdir(path.join(this.destDir, 'packages'));
		} catch {
			// Ignore
		}
	}

	async scaffoldMonorepoPackage(params: ScaffoldParams) {
		const packagesDir = path.join(this.destDir, 'packages');

		if (!fs.existsSync(packagesDir)) {
			throw new Error(
				`Cannot create a monorepo package as the monorepo infrastructure has not been scaffolded. Please run \`packemon scaffold --template monorepo ${this.dest}\`.`,
			);
		}

		const { packageName } = params;
		const folderName = packageName.startsWith('@') ? packageName.split('/')[1] : packageName;
		const packageDir = path.join(packagesDir, folderName);
		const packagePath = `packages/${folderName}`;

		await this.copyFilesFromTemplate('package', packageDir, params);
		await this.copyFilesFromTemplate('monorepo-package', packageDir, {
			...params,
			packagePath,
		});

		await this.addProjectReference(packagePath);
	}

	async scaffoldPolyrepo(params: ScaffoldParams) {
		await this.checkExistingInfrastructure('polyrepo');
		await this.copyFilesFromTemplate('base', this.destDir, params);
		await this.copyFilesFromTemplate('polyrepo', this.destDir, params);
		await this.installDependencies();
	}

	async scaffoldPolyrepoPackage(params: ScaffoldParams) {
		// Since a polyrepo and package are the same thing, scaffold the infra automatically
		await this.scaffoldPolyrepo(params);
		await this.copyFilesFromTemplate('package', this.destDir, params);
	}

	async addProjectReference(packagePath: string) {
		const tsconfigPath = path.join(this.destDir, 'tsconfig.json');
		const tsconfig = await this.loadJsonConfig<{ references?: { path: string }[] }>(tsconfigPath);

		if (!Array.isArray(tsconfig.references)) {
			tsconfig.references = [];
		}

		tsconfig.references.push({
			path: packagePath,
		});

		tsconfig.references.sort((a, b) => a.path.localeCompare(b.path));

		await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
	}

	async installDependencies() {
		if (this.skipInstall) {
			return;
		}

		await this.executeCommand(
			'yarn',
			[
				'add',
				'--dev',
				'eslint-config-beemo',
				'eslint',
				'jest-preset-beemo',
				'jest',
				'packemon',
				'prettier-config-beemo',
				'prettier',
				'tsconfig-beemo',
				'typescript',
			],
			{
				cwd: this.destDir,
			},
		);
	}

	async checkExistingInfrastructure(type: string) {
		const packagePath = path.join(this.destDir, 'package.json');

		if (!fs.existsSync(packagePath)) {
			return;
		}

		const pkg = await this.loadJsonConfig<{ infra: string }>(packagePath);

		if (pkg.infra !== type) {
			throw new Error(
				`Cannot scaffold ${type} infrastructure, as destination has already been setup as a ${pkg.infra}.`,
			);
		}
	}

	async copyFile(from: string, to: string, params: Record<string, number | string>) {
		const isPackage = from.endsWith('package.json') && to.endsWith('package.json');

		// Dont overwrite existing files (except package.json)
		if (fs.existsSync(to) && !this.force && !isPackage) {
			return;
		}

		const toDir = path.dirname(to);

		if (!fs.existsSync(toDir)) {
			await fs.ensureDir(toDir);
		}

		// Interpolate params into string content
		let content = await fs.readFile(from, 'utf8');

		Object.entries(params).forEach(([key, value]) => {
			content = content.replace(new RegExp(`<${key}>`, 'g'), String(value));
		});

		// Instead of overwriting package.json, we want to merge them
		if (isPackage) {
			const prevContent = await this.loadJsonConfig<object>(to);
			const nextContent = json.parse(content);

			await fs.writeJson(to, { ...prevContent, ...nextContent }, { spaces: 2 });

			// Otherwise write content as a string
		} else {
			await fs.writeFile(to, content, 'utf8');
		}
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
				this.copyFile(path.join(templateDir, file), path.join(destDir, file), { ...params }),
			),
		);
	}

	async loadJsonConfig<T>(filePath: string) {
		// Supports comments
		return json.parse<T>(await fs.readFile(filePath, 'utf8'));
	}
}
