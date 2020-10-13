import React from 'react';
import fileSize from 'filesize';
import { Style } from '@boost/cli';
import Build, { BuildProps } from './Build';

export interface BundleBuildProps extends BuildProps {
  stats?: { size: number };
}

export default function BundleBuild({ stats, ...props }: BundleBuildProps) {
  return (
    <Build {...props}>
      {stats?.size && <Style type="muted">{` (${fileSize(stats.size)})`}</Style>}
    </Build>
  );
}
