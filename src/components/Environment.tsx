import React from 'react';
import { Style } from '@boost/cli';
import { toArray } from '@boost/common';
import { BROWSER_TARGETS, NATIVE_TARGETS, NODE_SUPPORTED_VERSIONS } from '../constants';
import { Platform, Support } from '../types';

export interface EnvironmentProps {
  platform: Platform;
  support: Support;
}

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
    if (platform === 'native') {
      versions.add(`Native (${trimVersion(NATIVE_TARGETS[support])})`);
    } else if (platform === 'node') {
      versions.add(`Node v${trimVersion(NODE_SUPPORTED_VERSIONS[support])}`);
    } else if (platform === 'browser') {
      const targets =
        support === 'experimental' ? ['last 2 versions'] : toArray(BROWSER_TARGETS[support]);

      versions.add(`Browser (${targets.join(', ')})`);
    }
  });

  return versions;
}

export default function Environment({ platform, support }: EnvironmentProps) {
  return <Style type="muted">{Array.from(getVersionsCombo([platform], support)).join(', ')}</Style>;
}
