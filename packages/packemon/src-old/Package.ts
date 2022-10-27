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
	isComplete(): boolean {
		return this.artifacts.every((artifact) => artifact.isComplete());
	}

	isRunning(): boolean {
		return this.artifacts.some((artifact) => artifact.isRunning());
	}

	protected addEngines() {
		const artifact = (this.artifacts as CodeArtifact[])
			.filter((art) => art instanceof CodeArtifact)
			.filter((art) => art.platform === 'node')
			.reduce<CodeArtifact | null>(
				(oldest, art) =>
					!oldest || SUPPORT_PRIORITY[art.support] < SUPPORT_PRIORITY[oldest.support]
						? art
						: oldest,
				null,
			);

		if (!artifact) {
			return;
		}

		this.debug('Adding `engines` to `package.json`');

		const pkg = this.packageJson;

		if (!pkg.engines) {
			pkg.engines = {};
		}

		Object.assign(pkg.engines, {
			node: `>=${NODE_SUPPORTED_VERSIONS[artifact.support]}`,
			npm: toArray(NPM_SUPPORTED_VERSIONS[artifact.support])
				.map((v) => `>=${v}`)
				.join(' || '),
		});
	}

	protected addEntryPoints() {
		this.debug('Adding entry points to `package.json`');

		let mainEntry: string | undefined;
		let moduleEntry: string | undefined;
		let browserEntry: string | undefined;
		let buildCount = 0;

		// eslint-disable-next-line complexity
		this.artifacts.forEach((artifact) => {
			// Build files
			if (artifact instanceof CodeArtifact) {
				const mainEntryName = artifact.inputs.index ? 'index' : Object.keys(artifact.inputs)[0];

				buildCount += artifact.builds.length;

				// Generate `main`, `module`, and `browser` fields
				if (!mainEntry || (artifact.platform === 'node' && mainEntryName === 'index')) {
					mainEntry = artifact.findEntryPoint(['lib', 'cjs', 'mjs', 'esm'], mainEntryName);
				}

				if (!moduleEntry || (artifact.platform === 'browser' && mainEntryName === 'index')) {
					moduleEntry = artifact.findEntryPoint(['esm'], mainEntryName);
				}

				// Only include when we share a lib with another platform
				if (!browserEntry && artifact.platform === 'browser') {
					browserEntry = artifact.findEntryPoint(
						artifact.sharedLib ? ['lib', 'umd'] : ['umd'],
						mainEntryName,
					);
				}

				// Generate `bin` field
				if (
					artifact.inputs.bin &&
					artifact.platform === 'node' &&
					!isObject(this.packageJson.bin)
				) {
					this.packageJson.bin = artifact.findEntryPoint(['lib', 'cjs', 'mjs'], 'bin');
				}
			}

			// Type declarations
			if (artifact instanceof TypesArtifact) {
				const mainEntryName = artifact.builds.some((build) => build.outputName === 'index')
					? 'index'
					: artifact.builds[0].outputName;

				this.packageJson.types = artifact.findEntryPoint(mainEntryName);
			}
		});

		if (mainEntry) {
			this.packageJson.main = mainEntry;

			// Only set when we have 1 build, otherwise its confusing
			if (buildCount === 1) {
				if (mainEntry.includes('mjs/') || mainEntry.includes('esm/')) {
					this.packageJson.type = 'module';
				} else if (mainEntry.includes('cjs/')) {
					this.packageJson.type = 'commonjs';
				}
			}
		}

		if (moduleEntry) {
			this.packageJson.module = moduleEntry;
		}

		if (browserEntry && !isObject(this.packageJson.browser)) {
			this.packageJson.browser = browserEntry;
		}
	}

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
