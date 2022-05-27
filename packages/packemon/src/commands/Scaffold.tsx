/* eslint-disable react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop */

import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'fast-glob';
import fs from 'fs-extra';
import { Arg, Command, Config } from '@boost/cli';
import { json } from '@boost/common';
import { InfraType, ScaffoldParams, TemplateType } from '../types';

@Config('scaffold', 'Scaffold projects and packages with ease')
export class ScaffoldCommand extends Command {
	@Arg.Flag('Overwrite files if they already exist', { short: 'f' })
	force: boolean = false;

	@Arg.String('Package manager to install dependencies with', {
		choices: ['npm', 'pnpm', 'yarn'],
	})
	packageManager: string = 'yarn';

	@Arg.String('Folder in which packages will be located (monorepo only)')
	packagesFolder: string = 'packages';

	@Arg.Flag('Skip installation of npm dependencies')
	skipInstall: boolean = false;

	@Arg.String('Default template to scaffold', {
		choices: ['monorepo', 'monorepo-package', 'polyrepo', 'polyrepo-package'],
	})
	template?: TemplateType;

	dest: string = '';

	destDir: string = '';

	@Arg.Params({
		label: 'destination',
		description: 'Destination to copy template to',
		type: 'string',
		required: true,
	})
	async run(dest: string) {
		this.dest = dest;
		this.destDir = path.join(process.cwd(), dest);

		// This is purely for testing in CI, as we have no way to pass stdin
		if (process.env.CI) {
			await this.scaffold({
				author: 'Packemon',
				template: this.template!,
				projectName: 'packemon',
				packageName: 'example',
				packagePath: 'packages/example',
				repoUrl: 'packemon',
				year: new Date().getFullYear(),
			});

			return undefined;
		}

		const { Scaffold } = await import('../components/Scaffold');

		return (
			<Scaffold defaultTemplate={this.template} onComplete={(params) => this.scaffold(params)} />
		);
	}

	async scaffold(params: ScaffoldParams) {
		switch (params.template) {
			case 'polyrepo-package':
				return this.scaffoldPolyrepoPackage(params);
			case 'polyrepo':
				return this.scaffoldPolyrepo(params);
			case 'monorepo-package':
				return this.scaffoldMonorepoPackage(params);
			default:
				return this.scaffoldMonorepo(params);
		}
	}

	async scaffoldMonorepo(params: ScaffoldParams) {
		await this.checkExistingInfrastructure('monorepo');
		await this.copyFilesFromTemplate('base', this.destDir, params);
		await this.copyFilesFromTemplate('monorepo', this.destDir, {
			...params,
			packagesFolder: this.packagesFolder,
		});
		await this.installDependencies('monorepo');

		try {
			await fs.mkdir(path.join(this.destDir, this.packagesFolder));
		} catch {
			// Ignore
		}
	}

	async scaffoldMonorepoPackage(params: ScaffoldParams) {
		const packagesDir = path.join(this.destDir, this.packagesFolder);

		if (!fs.existsSync(packagesDir)) {
			throw new Error(
				`Cannot create a monorepo package as the monorepo infrastructure has not been scaffolded, or the ${this.packagesFolder} folder is missing. Please run \`packemon scaffold --template monorepo ${this.dest}\`.`,
			);
		}

		const { packageName } = params;
		const folderName = packageName.startsWith('@') ? packageName.split('/')[1] : packageName;
		const packageDir = path.join(packagesDir, folderName);
		const packagePath = `${this.packagesFolder}/${folderName}`;

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
		await this.installDependencies('polyrepo');
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

		tsconfig.references.push(
			{
				path: packagePath,
			},
			{
				path: path.join(packagePath, 'tests'),
			},
		);

		tsconfig.references.sort((a, b) => a.path.localeCompare(b.path));

		await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
	}

	async installDependencies(type: InfraType) {
		if (this.skipInstall) {
			return;
		}

		const args = [
			'@types/jest',
			'@types/node',
			'eslint-config-beemo',
			'eslint',
			'jest-preset-beemo',
			'jest',
			'packemon',
			'prettier-config-beemo',
			'prettier',
			'tsconfig-beemo',
			'typescript',
		];

		switch (this.packageManager) {
			case 'npm':
				args.unshift('install', '--save-dev');
				break;

			case 'pnpm':
				args.unshift('add', '--save-dev', type === 'monorepo' ? '-W' : '');
				break;

			default: {
				args.unshift('add', '--dev', type === 'monorepo' ? '-W' : '');
				break;
			}
		}

		await this.executeCommand(this.packageManager, args.filter(Boolean), {
			cwd: this.destDir,
		});
	}

	async checkExistingInfrastructure(type: InfraType) {
		const packagePath = path.join(this.destDir, 'package.json');

		if (!fs.existsSync(packagePath)) {
			return;
		}

		const pkg = await this.loadJsonConfig<{ infra: string }>(packagePath);

		if (pkg.infra === undefined) {
			throw new Error(
				`A package.json already exists, cannot setup ${type} infrastructure. Perhaps you want "${type}-package"?`,
			);
		} else if (pkg.infra !== type) {
			throw new Error(
				`Cannot scaffold ${type} infrastructure, as destination has already been setup as a ${pkg.infra}.`,
			);
		}
	}

	async copyFile(fromTemplate: string, toDest: string, params: Record<string, number | string>) {
		const isPackage = fromTemplate.endsWith('package.json') && toDest.endsWith('package.json');

		// Dont overwrite existing files (except package.json)
		if (fs.existsSync(toDest) && !this.force && !isPackage) {
			return;
		}

		const toDir = path.dirname(toDest);

		if (!fs.existsSync(toDir)) {
			await fs.ensureDir(toDir);
		}

		// Interpolate params into string content
		let content = await fs.readFile(fromTemplate, 'utf8');

		Object.entries(params).forEach(([key, value]) => {
			content = content.replace(new RegExp(`<${key}>`, 'g'), String(value));
		});

		// Instead of overwriting package.json, we want to merge them
		if (fs.existsSync(toDest) && isPackage) {
			const prevContent = await this.loadJsonConfig<object>(toDest);
			const nextContent = json.parse(content);

			await fs.writeJson(toDest, { ...prevContent, ...nextContent }, { spaces: 2 });

			// Otherwise write content as a string
		} else {
			await fs.writeFile(toDest, content, 'utf8');
		}
	}

	async copyFilesFromTemplate(
		template: string,
		destDir: string,
		params: Record<string, number | string> | ScaffoldParams,
	) {
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
