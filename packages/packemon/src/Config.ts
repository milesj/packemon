import { RollupOptions } from 'rollup';
import { TransformOptions } from '@babel/core';
import { Blueprint, Schemas } from '@boost/common';
import { Configuration } from '@boost/config';

export type ConfigMutator<T> = (config: T) => void;

export interface ConfigFile {
	babel?: ConfigMutator<TransformOptions>;
	rollup?: ConfigMutator<RollupOptions>;
}

export class Config extends Configuration<ConfigFile> {
	blueprint({ func }: Schemas): Blueprint<ConfigFile> {
		return {
			babel: func(),
			rollup: func(),
		};
	}

	override bootstrap() {
		this.configureFinder({
			errorIfNoRootFound: false,
		});

		this.addProcessHandler('babel', this.wrapMutator);
		this.addProcessHandler('rollup', this.wrapMutator);
	}

	wrapMutator<T>(prev?: ConfigMutator<T>, next?: ConfigMutator<T>) {
		return (options: T) => {
			prev?.(options);
			next?.(options);
		};
	}
}
