import React from 'react';
import { toArray } from '@boost/common';
import { Style } from '@boost/cli';
import { NODE_TARGETS, BROWSER_TARGETS } from '../constants';
import { Platform, Target } from '../types';

const PLATFORMS: { [K in Platform]: string } = {
  node: 'Node',
  browser: 'Browser',
};

const TARGETS: { [K in Target]: string } = {
  legacy: 'Legacy',
  modern: 'Modern',
  future: 'Future',
};

export interface TargetPlatformsProps {
  platforms: Platform[];
  target: Target;
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
      versions.push(`${PLATFORMS[platform]} (v${trimVersion(NODE_TARGETS[target])})`);
    } else if (platform === 'browser') {
      versions.push(`${PLATFORMS[platform]} (${toArray(BROWSER_TARGETS[target]).join(', ')})`);
    }
  });

  return (
    <Style type="muted">
      {TARGETS[target]}
      {' / '}
      {versions.join(', ')}
    </Style>
  );
}
