import { rollup, RollupCache } from 'rollup';
import { toArray, VirtualPath } from '@boost/common';
import { Artifact } from './Artifact';
import { removeSourcePath } from './helpers/removeSourcePath';
import { getRollupConfig } from './rollup/config';
import {
	BuildOptions,
	BuildResultFiles,
	CodeBuild,
	ConfigFile,
	Format,
	InputMap,
	PackageExportPaths,
	PackageExports,
	Platform,
	Support,
} from './types';

export class CodeArtifact extends Artifact<CodeBuild> {
	getPackageExports(): PackageExports {
		const exportMap: PackageExports = {};

		if (this.api === 'private' || this.bundle) {
			Object.keys(this.inputs).forEach((outputName) => {
				this.mapPackageExportsFromBuilds(outputName, exportMap);
			});
		} else {
			// Use subpath export patterns when not bundling
			// https://nodejs.org/api/packages.html#subpath-patterns
			this.mapPackageExportsFromBuilds('*', exportMap);
			this.mapPackageExportsFromBuilds('index', exportMap);
		}

		return exportMap;
	}

	// eslint-disable-next-line complexity
	protected mapPackageExportsFromBuilds(outputName: string, exportMap: PackageExports) {
		const defaultEntry = this.findEntryPoint(['lib'], outputName);
		let paths: PackageExportPaths = {};

		switch (this.platform) {
			case 'browser': {
				const moduleEntry = this.findEntryPoint(['esm'], outputName);

				paths = {
					module: moduleEntry, // Bundlers
					import: moduleEntry,
					default: this.findEntryPoint(['umd', 'lib'], outputName), // Node.js tooling
				};
				break;
			}

			case 'node': {
				paths = {
					import: this.findEntryPoint(['mjs'], outputName),
					require: this.findEntryPoint(['cjs'], outputName),
				};

				// Automatically apply the mjs wrapper for cjs
				if (!paths.import && outputName !== '*' && paths.require) {
					paths.import = (paths.require as string).replace('.cjs', '-wrapper.mjs');
				}

				if (!paths.require && defaultEntry) {
					paths.default = defaultEntry;
				}
				break;
			}

			case 'native':
				paths.default = defaultEntry;
				break;

			default:
				break;
		}

		// Remove undefined values
		for (const key in paths) {
			if (paths[key as keyof typeof paths] === undefined) {
				delete paths[key as keyof typeof paths];
			}
		}

		const pathsCount = Object.keys(paths).length;
		const pathsMap = {
			[this.platform === 'native' ? 'react-native' : this.platform]:
				// eslint-disable-next-line no-nested-ternary
				pathsCount === 0 && defaultEntry
					? defaultEntry
					: pathsCount === 1 && paths.default
					? paths.default
					: paths,
		};

		// Provide fallbacks if condition above is not
		if (defaultEntry) {
			pathsMap.default = defaultEntry;
		}

		// eslint-disable-next-line no-param-reassign
		exportMap[outputName === 'index' ? '.' : `./${outputName}`] = pathsMap;
	}
}
