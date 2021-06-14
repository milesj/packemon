import React from 'react';
import { Config } from '@boost/cli';
import { Pack } from '../components/Pack';
import { BuildCommand } from './Build';

@Config('pack', 'Clean, build, and validate packages for distribution')
export class PackCommand extends BuildCommand {
  override run() {
    return (
      <Pack
        addEngines={this.addEngines}
        addExports={this.addExports}
        analyze={this.analyze}
        concurrency={this.concurrency}
        declaration={this.declaration}
        declarationConfig={this.declarationConfig}
        filter={this.filter}
        filterFormats={this.formats}
        filterPlatforms={this.platforms}
        packemon={this.packemon}
        skipPrivate={this.skipPrivate}
        timeout={this.timeout}
      />
    );
  }
}
