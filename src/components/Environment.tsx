import React from 'react';
import { toArray } from '@boost/common';
import { Style } from '@boost/cli';
import { NODE_SUPPORTED_VERSIONS, BROWSER_TARGETS, NATIVE_TARGETS } from '../constants';
import { PackageConfig, Platform, Support } from '../types';

export interface EnvironmentProps {
  configs: PackageConfig[];
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

export default function Environment({ configs }: EnvironmentProps) {
  let versions = new Set<string>();

  configs.forEach(({ platforms, support }) => {
    versions = new Set([...versions, ...getVersionsCombo(platforms, support)]);
  });

  return <Style type="muted">{Array.from(versions).sort().join(', ')}</Style>;
}
