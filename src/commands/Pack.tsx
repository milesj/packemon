import React from 'react';
import { Config } from '@boost/cli';
import { Pack } from '../components/Pack';
import { BuildCommand } from './Build';

@Config('pack', 'Clean, build, and validate packages for distribution')
export class PackCommand extends BuildCommand {
  run() {
    return (
      <Pack
        packemon={this.packemon}
        addEngines={this.addEngines}
        addExports={this.addExports}
        analyze={this.analyze}
        concurrency={this.concurrency}
        declaration={this.declaration}
        skipPrivate={this.skipPrivate}
        timeout={this.timeout}
      />
    );
  }
}
