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

export interface TargetTextProps {
  platforms: Platform[];
  target: Target;
}

export default function TargetText({ platforms, target }: TargetTextProps) {
  const versions: string[] = [];

  platforms.forEach((platform) => {
    if (platform === 'node') {
      versions.push(`${PLATFORMS[platform]} (v${NODE_TARGETS[target]})`);
    } else if (platform === 'browser') {
      versions.push(`${PLATFORMS[platform]} (${toArray(BROWSER_TARGETS[target]).join(', ')})`);
    }
  });

  return (
    <Style type="muted">
      {TARGETS[target]}
      {' / '}
      {versions.join(' / ')}
    </Style>
  );
}
