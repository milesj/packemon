import React from 'react';
import { toArray } from '@boost/common';
import { Style } from '@boost/cli';
import { NODE_SUPPORTED_VERSIONS, BROWSER_TARGETS } from '../constants';
import { Platform, Support } from '../types';

const PLATFORMS: { [K in Platform]: string } = {
  node: 'Node',
  browser: 'Browser',
};

const SUPPORTED: { [K in Support]: string } = {
  legacy: 'Legacy',
  stable: 'Stable',
  current: 'Current',
  experimental: 'Experimental',
};

export interface TargetPlatformsProps {
  platforms: Platform[];
  target: Support;
}

function trimVersion(version: string) {
  const parts = version.split('.');

  while (parts[parts.length - 1] === '0') {
    parts.pop();
  }

  return parts.join('.');
}

export default function TargetPlatforms({ platforms, target }: TargetPlatformsProps) {
  const versions: string[] = [];

  platforms.forEach((platform) => {
    if (platform === 'node') {
      versions.push(`${PLATFORMS[platform]} (v${trimVersion(NODE_SUPPORTED_VERSIONS[target])})`);
    } else if (platform === 'browser') {
      versions.push(`${PLATFORMS[platform]} (${toArray(BROWSER_TARGETS[target]).join(', ')})`);
    }
  });

  return (
    <Style type="muted">
      {SUPPORTED[target]}
      {' / '}
      {versions.join(', ')}
    </Style>
  );
}
