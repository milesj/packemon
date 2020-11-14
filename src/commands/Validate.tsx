import React from 'react';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Packemon from '../Packemon';
import { ValidateOptions } from '../types';
import Validate from '../components/Validate';

@Config('validate', 'Validate package metadata and configuration')
export class ValidateCommand extends Command<GlobalOptions & ValidateOptions> {
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

  @Arg.Flag('Check that `author` and `contributors` contain a name and optional URL')
  people: boolean = true;

  @Arg.Flag('Check that `repository` exists and is a valid URL')
  repo: boolean = true;

  async run() {
    const validators = await new Packemon().validate({
      deps: this.deps,
      engines: this.engines,
      entries: this.entries,
      license: this.license,
      links: this.links,
      people: this.people,
      repo: this.repo,
    });

    return <Validate validators={validators} />;
  }
}
