import React from 'react';
import { Box } from 'ink';
import Spinner from 'ink-spinner';
import { formatMs } from '@boost/common';
import { Style } from '@boost/cli';
import Artifact from '../Artifact';
import { STATE_LABELS } from '../constants';
import BundleArtifact from '../BundleArtifact';
import BundleBuilds from './BundleBuilds';

export interface ArtifactRowProps {
  artifact: Artifact;
}

export default function ArtifactRow({ artifact }: ArtifactRowProps) {
  return (
    <Box flexDirection="row">
      <Box marginLeft={2} marginRight={1}>
        <Style type="default">{artifact.getLabel()}</Style>
      </Box>

      {artifact instanceof BundleArtifact && <BundleBuilds artifact={artifact} />}

      <Box marginLeft={2}>
        {artifact.isComplete() ? (
          <Style type="default" bold>
            {formatMs(artifact.result?.time || 0)}
          </Style>
        ) : (
          <Style type="muted">{STATE_LABELS[artifact.state]}</Style>
        )}

        {artifact.isRunning() && (
          <Box marginLeft={1}>
            <Style type="warning">
              <Spinner type="dots" />
            </Style>
          </Box>
        )}
      </Box>
    </Box>
  );
}