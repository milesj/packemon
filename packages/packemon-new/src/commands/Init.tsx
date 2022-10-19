/* eslint-disable react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop */

import { Arg, Config } from '@boost/cli';
import { DEFAULT_INPUT, DEFAULT_SUPPORT } from '../constants';
import { Package } from '../Package';
import { PackemonPackageConfig } from '../types';
import { BaseCommand } from './Base';

export interface InitOptions {
	force: boolean;
	skipPrivate: boolean;
}

@Config('init', 'Initialize and configure a package for Packemon')
export class InitCommand extends BaseCommand<InitOptions> {
	@Arg.Flag('Override existing configuration')
	force: boolean = false;

	async run() {
		const pkg = await this.packemon.loadPackage();

		if (!pkg) {
			this.log.error('No package found in current directory.');
			return undefined;
		}

		const name = pkg.getName();

		if (pkg.json.packemon && !this.force) {
			this.log.info(`Package ${name} has already been configured. Pass --force to override.`);
			return undefined;
		}

		// eslint-disable-next-line import/no-useless-path-segments
		const { Init } = await import('../components/Init/index.js');

		return (
			<Init
				packageName={name}
				onComplete={(config) => this.writeConfigToPackageJson(pkg, config)}
			/>
		);
	}

	// eslint-disable-next-line complexity
	formatConfigObject({
		format,
		inputs,
		namespace,
		platform,
		support,
	}: PackemonPackageConfig): PackemonPackageConfig {
		const config: PackemonPackageConfig = {};

		if (format) {
			if (Array.isArray(format) && format.length === 1) {
				[config.format] = format;
			} else {
				config.format = format;
			}
		}

		if (inputs && !(Object.keys(inputs).length === 1 && inputs.index === DEFAULT_INPUT)) {
			config.inputs = inputs;
		}

		if (namespace) {
			config.namespace = namespace;
		}

		if (platform) {
			if (Array.isArray(platform) && platform.length === 1) {
				[config.platform] = platform;
			} else {
				config.platform = platform;
			}
		}

		if (support && support !== DEFAULT_SUPPORT) {
			config.support = support;
		}

		return config;
	}

	async writeConfigToPackageJson(pkg: Package, config: PackemonPackageConfig) {
		// eslint-disable-next-line no-param-reassign
		pkg.json.packemon = this.formatConfigObject(config);

		return pkg.syncJson();
	}
}
