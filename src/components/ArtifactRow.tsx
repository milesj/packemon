import React from 'react';
import { Box } from 'ink';
import Spinner from 'ink-spinner';
import { formatMs } from '@boost/common';
import { Style, StyleType } from '@boost/cli';
import { figures } from '@boost/terminal';
import Artifact from '../Artifact';
import { BuildStatus } from '../types';

const STATUS_COLORS: { [K in BuildStatus]?: StyleType } = {
  pending: 'muted',
  passed: 'success',
  failed: 'failure',
  skipped: 'warning',
};

const STATUS_LABELS: { [K in BuildStatus]: string } = {
  pending: '',
  booting: 'Booting',
  building: 'Building',
  packing: 'Packing',
  passed: 'Passed',
  failed: 'Failed',
  skipped: 'Skipped',
};

export interface ArtifactRowProps {
  artifact: Artifact;
}

export default function ArtifactRow({ artifact }: ArtifactRowProps) {
  const { status } = artifact;

  return (
    <Box flexDirection="row">
      <Box marginLeft={2} marginRight={1}>
        <Style type="default">{artifact.getLabel()}</Style>
      </Box>

      {artifact.getBuilds().map((build) => (
        <Box key={build} marginLeft={1}>
          <Style bold type={STATUS_COLORS[status] || 'default'}>
            {figures.squareSmallFilled} {build.toLowerCase()}
          </Style>
        </Box>
      ))}

      <Box marginLeft={2}>
        <Style type="muted">
          {artifact.result && artifact.result.time > 0
            ? formatMs(artifact.result.time)
            : STATUS_LABELS[status]}
        </Style>

        {artifact.isRunning() && (
          <Style type="warning">
            <Spinner type="simpleDotsScrolling" />
          </Style>
        )}
      </Box>
    </Box>
  );
}
