import React from 'react';
import { Bind, Path, WorkspacePackage } from '@boost/common';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import Packemon from '../Packemon';
import Package from '../Package';
import Init from '../components/Init';
import { PackemonPackage, PackemonPackageConfig } from '../types';
import { DEFAULT_FORMAT, DEFAULT_INPUT, DEFAULT_PLATFORM, DEFAULT_SUPPORT } from '../constants';

@Config('init', 'Initialize Packemon for all packages')
export class InitCommand extends Command<GlobalOptions> {
  @Arg.Flag('Skip `private` packages')
  skipPrivate: boolean = false;

  protected packemon!: Packemon;

  async run() {
    this.packemon = new Packemon();

    const packages = await this.packemon.findPackages(this.skipPrivate);
    const unconfiguredPackages = packages.filter((pkg) => !pkg.package.packemon);

    return (
      <Init
        packageNames={unconfiguredPackages.map((pkg) => pkg.package.name)}
        onComplete={(configs) => {
          void this.writeConfigsToPackageJsons(unconfiguredPackages, configs);
        }}
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
      if (Array.isArray(format) && format.length === 0) {
        if (format[0] !== DEFAULT_FORMAT) {
          [config.format] = format;
        }
      } else {
        config.format = format;
      }
    }

    if (inputs) {
      config.inputs = {};

      if (!(Object.keys(inputs).length === 1 && inputs.index === DEFAULT_INPUT)) {
        Object.assign(config.inputs, inputs);
      }

      if (Object.keys(config.inputs).length === 0) {
        delete config.inputs;
      }
    }

    if (namespace) {
      config.namespace = namespace;
    }

    if (platform) {
      if (Array.isArray(platform) && platform.length === 0) {
        if (platform[0] !== DEFAULT_PLATFORM) {
          [config.platform] = platform;
        }
      } else {
        config.platform = platform;
      }
    }

    if (support && support !== DEFAULT_SUPPORT) {
      config.support = support;
    }

    return config;
  }

  @Bind()
  async writeConfigsToPackageJsons(
    packages: WorkspacePackage<PackemonPackage>[],
    configs: Record<string, PackemonPackageConfig>,
  ) {
    return Promise.all(
      packages.map((item) => {
        const pkg = new Package(this.packemon.project, new Path(item.metadata.packagePath), {
          ...item.package,
          packemon: this.formatConfigObject(configs[item.package.name]),
        });

        return pkg.syncPackageJson();
      }),
    );
  }
}
