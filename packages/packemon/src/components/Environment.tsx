import { Style } from '@boost/cli/react';
import { toArray } from '@boost/common';
import { BROWSER_TARGETS, NATIVE_TARGETS, NODE_SUPPORTED_VERSIONS } from '../constants';
import { Environment as EnvType, Platform, Support } from '../types';

export type EnvironmentProps =
	| {
			platform: Platform;
			support: Support;
	  }
	| { type: EnvType };

function trimVersion(version: string) {
	const parts = version.split('.');

	while (parts[parts.length - 1] === '0') {
		parts.pop();
	}

	return parts.join('.');
}

export function getVersionsCombo(platforms: Platform[], support: Support): Set<string> {
	const versions = new Set<string>();

	platforms.forEach((platform) => {
		switch (platform) {
			case 'native':
				versions.add(`Native (${trimVersion(NATIVE_TARGETS[support])}+)`);
				break;

			case 'node':
				versions.add(`Node v${trimVersion(NODE_SUPPORTED_VERSIONS[support])}+`);
				break;

			case 'browser': {
				const targets =
					support === 'experimental' ? ['last 2 versions'] : toArray(BROWSER_TARGETS[support]);

				versions.add(`Browser (${targets[0]})`);

				break;
			}

			// no default
		}
	});

	return versions;
}

export function Environment(props: EnvironmentProps) {
	let platform: string;
	let support: string;

	if ('type' in props) {
		// eslint-disable-next-line react/destructuring-assignment
		[platform, support] = props.type.split(':');
	} else {
		({ platform, support } = props);
	}

	return (
		<Style type="muted">
			{[...getVersionsCombo([platform as Platform], support as Support)].join(', ')}
		</Style>
	);
}
