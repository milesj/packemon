import React from 'react';
import { Box } from 'ink';
import { Artifact } from '../Artifact';
import { Environment as EnvType } from '../types';
import { ArtifactRow } from './ArtifactRow';
import { Environment } from './Environment';

export interface ArtifactListProps {
  artifacts?: Artifact[];
  environment?: EnvType;
}

export function ArtifactList({ artifacts = [], environment }: ArtifactListProps) {
  return (
    <>
      {!!environment && (
        <Box marginLeft={1}>
          <Environment type={environment} />
        </Box>
      )}

      {artifacts.map((artifact) => (
        <ArtifactRow key={`${environment}-${artifact}`} artifact={artifact} />
      ))}
    </>
  );
}
