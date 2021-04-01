import React from 'react';
import { Arg, Config } from '@boost/cli';
import { Path, WorkspacePackage } from '@boost/common';
import { Init } from '../components/Init';
import { DEFAULT_FORMAT, DEFAULT_INPUT, DEFAULT_SUPPORT } from '../constants';
import { Package } from '../Package';
import { PackemonPackage, PackemonPackageConfig } from '../types';
import { BaseCommand } from './Base';

export interface InitOptions {
  force: boolean;
  skipPrivate: boolean;
}

@Config('init', 'Initialize and configure Packemon for packages')
export class InitCommand extends BaseCommand<InitOptions> {
  @Arg.Flag('Override already configured packages')
  force: boolean = false;

  async run() {
    const packages = await this.packemon.findPackagesInProject({
      filterFormats: this.filterFormats,
      filterPackages: this.filterPackages,
      filterPlatforms: this.filterPlatforms,
      skipPrivate: this.skipPrivate,
    });

    const unconfiguredPackages = this.force
      ? packages
      : packages.filter((pkg) => !pkg.package.packemon);

    if (unconfiguredPackages.length === 0) {
      if (packages.length === 0) {
        this.log.error('No packages found in project.');
      } else {
        this.log.info('All packages have been configured. Pass --force to override.');
      }

      return Promise.resolve();
    }

    return (
      <Init
        packageNames={unconfiguredPackages.map((pkg) => pkg.package.name)}
        onComplete={(configs) => this.writeConfigsToPackageJsons(unconfiguredPackages, configs)}
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
      if (Array.isArray(format) && format.length === 1) {
        if (format[0] !== DEFAULT_FORMAT) {
          [config.format] = format;
        }
      } else {
        config.format = format;
      }
    }

    if (inputs) {
      if (!(Object.keys(inputs).length === 1 && inputs.index === DEFAULT_INPUT)) {
        config.inputs = inputs;
      }
    }

    if (namespace) {
      config.namespace = namespace;
    }

    if (platform) {
      if (Array.isArray(platform) && platform.length === 1) {
        [config.platform] = platform;
      } else {
        config.platform = platform;
      }
    }

    if (support && support !== DEFAULT_SUPPORT) {
      config.support = support;
    }

    return config;
  }

  async writeConfigsToPackageJsons(
    packages: WorkspacePackage<PackemonPackage>[],
    configs: Record<string, PackemonPackageConfig>,
  ) {
    await Promise.all(
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
