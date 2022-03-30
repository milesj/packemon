/* eslint-disable no-param-reassign */

import packList from 'npm-packlist';
import { Arg, Config } from '@boost/cli';
import type { FileFormat } from '../components/Files';
import type { FileTree } from '../components/Files/Tree';
import { BaseCommand } from './Base';

@Config('files', 'List all files that will be distributed within a package')
export class FilesCommand extends BaseCommand {
	@Arg.String('Format to display files in', {
		choices: ['list', 'tree'],
	})
	format: FileFormat = 'tree';

	@Arg.Params({
		label: 'package',
		description: 'Name of package to inspect',
		type: 'string',
		required: true,
	})
	async run(pkgName: string) {
		const packages = await this.packemon.loadConfiguredPackages(this.getBuildOptions());
		const pkg = packages.find((p) => p.getName() === pkgName || p.path.name() === pkgName);

		if (!pkg) {
			throw new Error(`No package found with name "${pkgName}".`);
		}

		const files = await packList({ path: pkg.path.path() });
		const tree = this.convertFilesToTree(files);

		const { Files } = await import('../components/Files');

		return <Files format={this.format} list={files} name={pkg.getName()} tree={tree} />;
	}

	protected convertFilesToTree(files: string[]): FileTree {
		const root: FileTree = {
			files: [],
			folders: {},
		};

		const convert = (file: string, tree: FileTree) => {
			let slashIndex = file.indexOf('/');

			if (slashIndex === -1) {
				slashIndex = file.indexOf('\\');
			}

			if (slashIndex === -1) {
				(tree.files ||= []).push(file);
			} else {
				const folder = file.slice(0, slashIndex);

				tree.folders ||= {};
				tree.folders[folder] ||= {};

				convert(file.slice(slashIndex + 1), tree.folders[folder]);
			}
		};

		files.forEach((file) => {
			convert(file, root);
		});

		return root;
	}
}
