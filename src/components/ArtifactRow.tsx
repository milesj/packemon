import React from 'react';
import { Box } from 'ink';
import Spinner from 'ink-spinner';
import { formatMs } from '@boost/common';
import { Style } from '@boost/cli';
import Artifact from '../Artifact';
import { STATE_LABELS } from '../constants';
import BundleArtifact from '../BundleArtifact';
import BundleTarget from './BundleTarget';
import Target from './Target';

export interface ArtifactRowProps {
  artifact: Artifact;
}

export default function ArtifactRow({ artifact }: ArtifactRowProps) {
  return (
    <Box flexDirection="row">
      <Box marginLeft={2}>
        <Style type="default">{artifact.getLabel()}</Style>
      </Box>

      {artifact.getBuildTargets().map((target, index) => {
        const props = {
          target,
          state: artifact.state,
        };

        if (artifact instanceof BundleArtifact) {
          return <BundleTarget key={target} {...props} stats={artifact.builds[index].stats} />;
        }

        return <Target key={target} {...props} />;
      })}

      <Box marginLeft={1}>
        {artifact.isComplete() ? (
          <Style type="default" bold>
            {formatMs(artifact.buildResult.time)}
          </Style>
        ) : (
          <Style type="muted">{STATE_LABELS[artifact.state]}</Style>
        )}
      </Box>

      {artifact.isRunning() && (
        <Box marginLeft={1}>
          <Style type="warning">
            <Spinner type="dots" />
          </Style>
        </Box>
      )}
    </Box>
  );
}
