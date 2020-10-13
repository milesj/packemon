import React from 'react';
import { Box } from 'ink';
import size from 'filesize';
import { Style } from '@boost/cli';
import { figures } from '@boost/terminal';
import BundleArtifact from '../BundleArtifact';
import { STATE_COLORS } from '../constants';

export interface BundleBuildsProps {
  artifact: BundleArtifact;
}

export default function BundleBuilds({ artifact }: BundleBuildsProps) {
  return (
    <>
      {artifact.getBuilds().map((build) => {
        const stats = artifact.result?.stats[build];

        return (
          <Box key={build} marginLeft={1}>
            <Style bold type={STATE_COLORS[artifact.state] || 'default'}>
              {figures.squareSmallFilled} {build.toLowerCase()}
            </Style>

            {stats && <Style type="muted">{` (${size(stats.size)})`}</Style>}
          </Box>
        );
      })}
    </>
  );
}
