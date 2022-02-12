import { Blueprint, Schemas } from '@boost/common';
import { Configuration } from '@boost/config';
import { ConfigFile, ConfigMutator } from './types';

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
			extensions: ['js', 'ts'],
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
