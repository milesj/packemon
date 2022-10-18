import fs from 'fs-extra';
import rimraf from 'rimraf';
import {
	isObject,
	json,
	Memoize,
	Path,
	PortablePath,
	toArray,
	VirtualPath,
	WorkspacePackage,
} from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import { Context, PooledPipeline } from '@boost/pipeline';
import { CodeArtifact } from './CodeArtifact';
import { Config } from './Config';
import { matchesPattern } from './helpers/matchesPattern';
import { Package } from './Package';
import { PackageValidator } from './PackageValidator';
import { Project } from './Project';
import { buildBlueprint, validateBlueprint } from './schemas';
import type {
	ApiType,
	BuildOptions,
	FilterOptions,
	PackemonPackage,
	Platform,
	TypesBuild,
	ValidateOptions,
} from './types';
import { TypesArtifact } from './TypesArtifact';

export class Packemon {
	readonly config: Config = new Config('packemon');

	readonly debug: Debugger;

	readonly onPackageBuilt = new Event<[Package]>('package-built');

	readonly onPackagesLoaded = new Event<[Package[]]>('packages-loaded');

	readonly project: Project;

	readonly root: Path;

	readonly workingDir: Path;

	/**
	 * Generate build and optional types artifacts for each package in the list.
	 */
	generateArtifacts(
		packages: Package[],
		{ declaration, filterFormats, filterPlatforms }: BuildOptions = {},
	): Package[] {
		this.debug('Generating artifacts for packages');

		packages.forEach((pkg) => {
			const typesBuilds: Record<string, TypesBuild> = {};
			const sharedLib = this.requiresSharedLib(pkg);
			const apiType = this.determineApiType(pkg);

			pkg.configs.forEach((config, index) => {
				let builds = config.formats.map((format) => ({
					format,
				}));

				if (filterFormats) {
					this.debug('Filtering formats with pattern: %s', filterFormats);

					builds = builds.filter((build) => matchesPattern(build.format, filterFormats));
				}

				if (filterPlatforms) {
					this.debug('Filtering platforms with pattern: %s', filterPlatforms);

					if (!matchesPattern(config.platform, filterPlatforms)) {
						return;
					}
				}

				if (builds.length === 0) {
					return;
				}

				const artifact = new CodeArtifact(pkg, builds);
				artifact.api = apiType;
				artifact.bundle = config.bundle;
				artifact.configGroup = index;
				artifact.externals = config.externals;
				artifact.inputs = config.inputs;
				artifact.namespace = config.namespace;
				artifact.platform = config.platform;
				artifact.sharedLib = sharedLib;
				artifact.support = config.support;

				pkg.addArtifact(artifact);

				Object.entries(config.inputs).forEach(([outputName, inputFile]) => {
					typesBuilds[outputName] = { inputFile, outputName };
				});
			});

			if (declaration) {
				const artifact = new TypesArtifact(pkg, Object.values(typesBuilds));
				artifact.api = apiType;
				artifact.bundle = pkg.configs.some((config) => config.bundle);

				pkg.addArtifact(artifact);
			}

			this.debug(' - %s: %s', pkg.getName(), pkg.artifacts.join(', '));
		});

		// Remove packages that have no artifacts
		return packages.filter((pkg) => pkg.artifacts.length > 0);
	}

	/**
	 * Cleanup all package and artifact related files in all packages.
	 */
	protected async cleanTemporaryFiles(packages: Package[]) {
		this.debug('Cleaning temporary build files');

		await Promise.all(packages.map((pkg) => pkg.cleanup()));
	}

	/**
	 * When 1 config needs a private API, all other configs should be private,
	 * otherwise we will have conflicting output structures and exports.
	 */
	protected determineApiType(pkg: Package): ApiType {
		return pkg.configs.some((cfg) => cfg.api === 'private') ? 'private' : 'public';
	}

	/**
	 * Format "lib" is a shared format across all platforms,
	 * and when a package wants to support multiple platforms,
	 * we must account for this and alter the output paths.
	 */
	protected requiresSharedLib(pkg: Package): boolean {
		const platformsToCheck = new Set<Platform>();
		let libFormatCount = 0;

		pkg.configs.forEach((config) => {
			platformsToCheck.add(config.platform);

			config.formats.forEach((format) => {
				if (format === 'lib') {
					libFormatCount += 1;
				}
			});
		});

		return platformsToCheck.size > 1 && libFormatCount > 1;
	}
}
