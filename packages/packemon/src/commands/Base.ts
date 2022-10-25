import { applyStyle, Arg, Command, GlobalOptions, PrimitiveType } from '@boost/cli';
import { figures } from '@boost/terminal';
import { PackageValidator } from '../PackageValidator';
import { Packemon } from '../Packemon';

export interface CommonOptions {
	cwd: string;
	skipPrivate: boolean;
}

export abstract class BaseCommand<
	O extends object = {},
	P extends PrimitiveType[] = string[],
> extends Command<CommonOptions & GlobalOptions & O, P> {
	@Arg.String('Current working directory to run in', { category: 'global' })
	cwd: string = '';

	@Arg.String('Only generate specific output formats', { category: 'filter', short: 'f' })
	formats: string = '';

	@Arg.Flag('Search and load local config files', { category: 'global' })
	loadConfigs: boolean = false;

	@Arg.String('Only target specific platforms', { category: 'filter', short: 'p' })
	platforms: string = '';

	@Arg.Flag('Display less or no output while running', { category: 'global' })
	quiet: boolean = !!process.env.CI;

	@Arg.Flag('Skip `private` packages', { category: 'filter' })
	skipPrivate: boolean = false;

	protected get packemon() {
		return new Packemon(this.cwd || process.cwd());
	}

	protected async getPackage() {
		const pkg = await this.packemon.findPackage({ skipPrivate: this.skipPrivate });

		if (!pkg) {
			throw new Error(
				`No \`packemon\` configured package found in ${applyStyle(
					this.packemon.workingDir.path(),
					'info',
				)}!`,
			);
		}

		return pkg;
	}

	protected renderValidator(validator: PackageValidator) {
		if (validator.hasErrors()) {
			validator.errors.forEach((error) => {
				this.log.error(applyStyle(` ${figures.bullet} ${error}`, 'failure'));
			});
		}

		if (validator.hasWarnings()) {
			validator.warnings.forEach((warning) => {
				this.log.warn(applyStyle(` ${figures.bullet} ${warning}`, 'warning'));
			});
		}

		if (validator.hasErrors()) {
			this.exit(`Found errors in ${validator.package.getName()} package!`);
		}
	}
}
