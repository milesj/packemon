import React from 'react';
import { Box } from 'ink';
import Artifact from '../Artifact';
import { Platform, Support } from '../types';
import ArtifactRow from './ArtifactRow';
import Environment from './Environment';

export interface ArtifactListProps {
  artifacts?: Artifact[];
  environment?: string;
}

export default function ArtifactList({ artifacts = [], environment = '' }: ArtifactListProps) {
  const [platform, support] = environment.split(':');

  return (
    <>
      {environment && (
        <Box marginLeft={2}>
          <Environment platform={platform as Platform} support={support as Support} />
        </Box>
      )}

      {artifacts.map((artifact) => (
        <ArtifactRow key={`${environment}-${artifact}`} artifact={artifact} />
      ))}
    </>
  );
}
