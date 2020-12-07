import React from 'react';
import { Bind } from '@boost/common';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Packemon from '../Packemon';
import Init from '../components/Init';
import { PackemonPackageConfig } from '../types';

@Config('init', 'Initialize Packemon for all packages')
export class InitCommand extends Command<GlobalOptions> {
  @Arg.Flag('Skip `private` packages')
  skipPrivate: boolean = false;

  async run() {
    const packemon = new Packemon();
    const packages = await packemon.findPackages(this.skipPrivate);

    return (
      <Init
        packageNames={packages.map((pkg) => pkg.package.name)}
        onComplete={this.writeConfigsToPackageJsons}
      />
    );
  }

  @Bind()
  async writeConfigsToPackageJsons(configs: Record<string, PackemonPackageConfig>) {}
}
