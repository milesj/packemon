import { RollupOptions } from 'rollup';
import { TransformOptions } from '@babel/core';
import { Blueprint, Contract, Path, Schemas } from '@boost/common';
import { requireModule } from '@boost/module';

export interface ConfigFile {
	babel?: (config: TransformOptions) => void;
	rollup?: (config: RollupOptions) => void;
}

export class Config extends Contract<ConfigFile> {
	blueprint({ func }: Schemas): Blueprint<ConfigFile> {
		return {
			babel: func(),
			rollup: func(),
		};
	}

	loadFromPath(file: Path): ConfigFile {
		if (!file.exists()) {
			throw new Error(`Configuration file \`${file}\` does not exist.`);
		}

		const config = requireModule<ConfigFile>(file).default;

		this.configure(config);

		return this.options;
	}

	load(root: Path): ConfigFile {
		const tsConfig = root.append('packemon.config.ts');

		if (tsConfig.exists()) {
			return this.loadFromPath(tsConfig);
		}

		const jsConfig = root.append('packemon.config.js');

		if (jsConfig.exists()) {
			return this.loadFromPath(jsConfig);
		}

		return this.options;
	}
}
