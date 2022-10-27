import glob from 'fast-glob';
import fs from 'fs-extra';
import semver from 'semver';
import { deepMerge, isObject, Memoize, PackageStructure, Path, toArray } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { CodeArtifact } from './CodeArtifact';
import {
	DEFAULT_FORMATS,
	EXCLUDE,
	EXTENSIONS,
	FORMATS_BROWSER,
	FORMATS_NATIVE,
	FORMATS_NODE,
	NODE_SUPPORTED_VERSIONS,
	NPM_SUPPORTED_VERSIONS,
	SUPPORT_PRIORITY,
} from './constants';
import { loadModule } from './helpers/loadModule';
import { sortExports } from './helpers/sortExports';
import { Project } from './Project';
import { packemonBlueprint } from './schemas';
import {
	BuildOptions,
	ConfigFile,
	FeatureFlags,
	InputMap,
	PackageConfig,
	PackageExportPaths,
	PackageExports,
	PackemonPackage,
	PackemonPackageConfig,
	TSConfigStructure,
} from './types';
import { TypesArtifact } from './TypesArtifact';

export class Package {
	protected addExports() {
		this.debug('Adding `exports` to `package.json`');

		let exportMap: PackageExports = {
			'./package.json': './package.json',
		};

		this.artifacts.forEach((artifact) => {
			Object.entries(artifact.getPackageExports()).forEach(([path, conditions]) => {
				if (!conditions) {
					return;
				}

				if (!exportMap[path]) {
					exportMap[path] = conditions;
					return;
				}

				if (typeof exportMap[path] === 'string') {
					exportMap[path] = { default: exportMap[path] };
				}

				exportMap[path] = deepMerge<PackageExportPaths, PackageExportPaths>(
					exportMap[path] as PackageExportPaths,
					typeof conditions === 'string' ? { default: conditions } : conditions,
				);
			});
		});

		exportMap = sortExports(exportMap);

		if (isObject(this.packageJson.exports)) {
			Object.assign(this.packageJson.exports, exportMap);
		} else {
			this.packageJson.exports = exportMap as PackageStructure['exports'];
		}
	}
}
