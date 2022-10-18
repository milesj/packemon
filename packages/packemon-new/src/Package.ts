import { Path, toArray } from '@boost/common';
import { optimal } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
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
import { packemonBlueprint } from './schemas';
import { PackageConfig, PackemonPackage, PackemonPackageConfig } from './types';

export class Package {
	// readonly artifacts: Artifact[] = [];

	readonly configs: PackageConfig[] = [];

	readonly debug!: Debugger;

	readonly json: PackemonPackage;

	readonly jsonPath: Path;

	readonly path: Path;

	constructor(path: Path, contents: PackemonPackage) {
		this.path = path;
		this.jsonPath = this.path.append('package.json');
		this.json = contents;
		this.debug = createDebugger(['packemon', 'package', this.getSlug()]);
	}

	async clean(): Promise<void> {
		this.debug('Cleaning build artifacts');

		// await Promise.all(this.artifacts.map((artifact) => artifact.cleanup()));
	}

	getName(): string {
		return this.json.name;
	}

	getSlug(): string {
		return this.path.name(true);
	}

	setConfigs(configs: PackemonPackageConfig[]) {
		configs.forEach((cfg) => {
			const config = optimal(packemonBlueprint, {
				name: this.getName(),
			}).validate(cfg);

			// eslint-disable-next-line complexity
			toArray(config.platform).forEach((platform) => {
				let { api, bundle } = config;
				let formats = config.format ? [config.format] : [];

				switch (platform) {
					case 'native':
						formats = formats.filter((format) => (FORMATS_NATIVE as string[]).includes(format));

						if (formats.length === 0) {
							formats.push(DEFAULT_FORMATS.native);
						}
						break;

					case 'node':
						if (cfg.api === undefined) {
							api = 'public';
						}

						if (cfg.bundle === undefined) {
							bundle = false;
						}

						formats = formats.filter((format) => (FORMATS_NODE as string[]).includes(format));

						if (formats.length === 0) {
							formats.push(DEFAULT_FORMATS.node);
						}
						break;

					default:
						formats = formats.filter((format) => (FORMATS_BROWSER as string[]).includes(format));

						if (formats.length === 0) {
							formats.push(DEFAULT_FORMATS.browser);
						}

						// Auto-support lib builds for test environments
						if (formats.includes('esm') && !formats.includes('lib')) {
							formats.push('lib');
						}

						if (config.namespace && !formats.includes('umd')) {
							formats.push('umd');
						}
						break;
				}

				this.configs.push({
					api,
					bundle,
					externals: toArray(config.externals),
					formats,
					inputs: config.inputs,
					namespace: config.namespace,
					platform,
					support: config.support,
				});
			});
		});
	}
}
