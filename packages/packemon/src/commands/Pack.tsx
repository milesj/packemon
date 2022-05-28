import { Config } from '@boost/cli';
import { BuildCommand } from './Build';

@Config('pack', 'Clean, build, and validate packages for distribution')
export class PackCommand extends BuildCommand {
	override async run() {
		// eslint-disable-next-line import/no-useless-path-segments
		const { Pack } = await import('../components/Pack/index.js');

		return (
			<Pack
				addEngines={this.addEngines}
				addExports={this.addExports}
				addFiles={this.addFiles}
				concurrency={this.concurrency}
				declaration={this.declaration}
				declarationConfig={this.declarationConfig}
				filter={this.filter}
				filterFormats={this.formats}
				filterPlatforms={this.platforms}
				loadConfigs={this.loadConfigs}
				packemon={this.packemon}
				skipPrivate={this.skipPrivate}
				stamp={this.stamp}
				timeout={this.timeout}
			/>
		);
	}
}
