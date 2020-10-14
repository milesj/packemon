import React from 'react';
import fileSize from 'filesize';
import { Style } from '@boost/cli';
import Target, { TargetProps } from './Target';

export interface BundleTargetProps extends TargetProps {
  stats?: { size: number };
}

export default function BundleTarget({ stats, ...props }: BundleTargetProps) {
  return (
    <Target {...props}>
      {stats?.size && <Style type="muted">{` (${fileSize(stats.size)})`}</Style>}
    </Target>
  );
}
