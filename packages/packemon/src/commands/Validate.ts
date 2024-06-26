import { Arg, Config } from '@boost/cli';
import type { ValidateOptions } from '../types';
import { BaseCommand } from './Base';

@Config('validate', 'Validate package metadata and configuration')
export class ValidateCommand extends BaseCommand<Required<ValidateOptions>> {
	@Arg.Flag('Check that dependencies have valid versions and constraints')
	deps: boolean = true;

	@Arg.Flag('Check that the current runtime satisfies `engines` constraint')
	engines: boolean = true;

	@Arg.Flag('Check that `main`, `module`, and other entry points are valid paths')
	entries: boolean = true;

	@Arg.Flag('Check that a SPDX license is provided')
	license: boolean = true;

	@Arg.Flag('Check that `homepage` and `bugs` links are valid URLs')
	links: boolean = true;

	@Arg.Flag('Check that `name`, `version`, `description`, and `keywords` are valid')
	meta: boolean = true;

	@Arg.Flag('Check that `author` and `contributors` contain a name and optional URL')
	people: boolean = true;

	@Arg.Flag('Check that `repository` exists and is a valid URL')
	repo: boolean = true;

	async run() {
		const pkg = await this.getPackage();

		const validator = await this.packemon.validate(pkg, {
			deps: this.deps,
			engines: this.engines,
			entries: this.engines,
			license: this.license,
			links: this.links,
			meta: this.meta,
			people: this.people,
			quiet: this.quiet,
			repo: this.repo,
			skipPrivate: this.skipPrivate,
		});

		this.renderValidator(validator);
	}
}
