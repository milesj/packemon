import React from 'react';
import { Box } from 'ink';
import Artifact from '../Artifact';
import ArtifactRow from './ArtifactRow';
import Environment from './Environment';

export interface ArtifactListProps {
  artifacts?: Artifact[];
  environment?: string;
}

export default function ArtifactList({ artifacts = [], environment = '' }: ArtifactListProps) {
  return (
    <>
      {!!environment && (
        <Box marginLeft={1}>
          <Environment target={environment} />
        </Box>
      )}

      {artifacts.map((artifact) => (
        <ArtifactRow key={`${environment}-${artifact}`} artifact={artifact} />
      ))}
    </>
  );
}
