import path from 'path';
import execa from 'execa';
import { VirtualPath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { removeSourcePath } from './helpers/removeSourcePath';
import { BuildOptions, PackageExports, TSConfigStructure, TypesBuild } from './types';

export class TypesArtifact extends Artifact<TypesBuild> {
	getPackageExports(): PackageExports {
		const exportMap: PackageExports = {};

		if (this.api === 'private' || this.bundle) {
			this.builds.forEach(({ outputName }) => {
				exportMap[outputName === 'index' ? '.' : `./${outputName}`] = {
					types: this.findEntryPoint(outputName),
				};
			});
		} else {
			const ext = this.getDeclExt();

			exportMap['./*'] = { types: `./dts/*.${ext}` };
			exportMap['.'] = { types: `./dts/index.${ext}` };
		}

		return exportMap;
	}
}
