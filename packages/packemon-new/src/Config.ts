import { Blueprint, Schemas } from '@boost/common';
import { Configuration } from '@boost/config';
import { BuildParams, ConfigFile, ConfigMutator, ConfigMutatorWithBuild } from './types';

export class Config extends Configuration<ConfigFile> {
	blueprint({ bool, func }: Schemas): Blueprint<ConfigFile> {
		return {
			babelInput: func(),
			babelOutput: func(),
			rollupInput: func(),
			rollupOutput: func(),
			swc: bool(),
			swcInput: func(),
			swcOutput: func(),
		};
	}

	override bootstrap() {
		this.configureFinder({
			errorIfNoRootFound: false,
			extensions: ['js', 'ts'],
		});

		this.addProcessHandler('babelInput', this.wrapMutator);
		this.addProcessHandler('babelOutput', this.wrapBuildMutator);
		this.addProcessHandler('rollupInput', this.wrapMutator);
		this.addProcessHandler('rollupOutput', this.wrapBuildMutator);
	}

	wrapMutator<T>(prev?: ConfigMutator<T>, next?: ConfigMutator<T>) {
		return (options: T) => {
			prev?.(options);
			next?.(options);
		};
	}

	wrapBuildMutator<T>(prev?: ConfigMutatorWithBuild<T>, next?: ConfigMutatorWithBuild<T>) {
		return (options: T, build: BuildParams) => {
			prev?.(options, build);
			next?.(options, build);
		};
	}
}
