import React from 'react';
import { Box } from 'ink';
import Spinner from 'ink-spinner';
import { formatMs } from '@boost/common';
import { Style, StyleType } from '@boost/cli';
import { figures } from '@boost/terminal';
import Artifact from '../Artifact';
import { ArtifactState } from '../types';

const STATE_COLORS: { [K in ArtifactState]?: StyleType } = {
  pending: 'muted',
  passed: 'success',
  failed: 'failure',
  skipped: 'warning',
};

const STATE_LABELS: { [K in ArtifactState]: string } = {
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
  const { state } = artifact;

  return (
    <Box flexDirection="row">
      <Box marginLeft={2} marginRight={1}>
        <Style type="default">{artifact.getLabel()}</Style>
      </Box>

      {artifact.getBuilds().map((build) => (
        <Box key={build} marginLeft={1}>
          <Style bold type={STATE_COLORS[state] || 'default'}>
            {figures.squareSmallFilled} {build.toLowerCase()}
          </Style>
        </Box>
      ))}

      <Box marginLeft={2}>
        <Style type="muted">
          {artifact.result && artifact.result.time > 0
            ? formatMs(artifact.result.time)
            : STATE_LABELS[state]}
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
