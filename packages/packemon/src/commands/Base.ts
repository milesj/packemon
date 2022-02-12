import { Arg, Command, GlobalOptions, PrimitiveType } from '@boost/cli';
import { Memoize } from '@boost/common';
import { Packemon } from '../Packemon';
import { BuildOptions } from '../types';

export interface CommonOptions {
	cwd: string;
	skipPrivate: boolean;
}

export abstract class BaseCommand<
	O extends object = {},
	P extends PrimitiveType[] = string[],
> extends Command<CommonOptions & GlobalOptions & O, P> {
	@Arg.String('Search and load local config files', { category: 'global' })
	configs: boolean = false;

	@Arg.String('Current working directory to run in', { category: 'global' })
	cwd: string = '';

	@Arg.String('Filter packages to build', { category: 'filter' })
	filter: string = '';

	@Arg.String('Only generate specific output formats', { category: 'filter', short: 'f' })
	formats: string = '';

	@Arg.String('Only target specific platforms', { category: 'filter', short: 'p' })
	platforms: string = '';

	@Arg.Flag('Display less or no output while running', { category: 'global' })
	quiet: boolean = !!process.env.CI;

	@Arg.Flag('Skip `private` packages', { category: 'filter' })
	skipPrivate: boolean = false;

	@Memoize()
	protected get packemon() {
		return new Packemon(this.cwd || process.cwd());
	}

	protected getBuildOptions(): BuildOptions {
		return {
			configs: this.configs,
			filter: this.filter,
			filterFormats: this.formats,
			filterPlatforms: this.platforms,
			skipPrivate: this.skipPrivate,
		};
	}
}
