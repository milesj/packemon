import React from 'react';
import { toArray } from '@boost/common';
import { Style } from '@boost/cli';
import { NODE_SUPPORTED_VERSIONS, BROWSER_TARGETS } from '../constants';
import { PackageConfig } from '../types';

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

export default function Environment({ configs }: EnvironmentProps) {
  const versions = new Set<string>();

  configs.forEach(({ platforms, support }) => {
    platforms.forEach((platform) => {
      if (platform === 'node') {
        versions.add(`Node v${trimVersion(NODE_SUPPORTED_VERSIONS[support])}`);
      } else if (platform === 'browser') {
        versions.add(`Browser (${toArray(BROWSER_TARGETS[support]).join(', ')})`);
      }
    });
  });

  return <Style type="muted">{Array.from(versions).sort().join(', ')}</Style>;
}
