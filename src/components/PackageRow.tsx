import React from 'react';
import { Box } from 'ink';
import { Style } from '@boost/cli';
import Package from '../Package';
import ArtifactRow from './ArtifactRow';
import TargetPlatforms from './TargetPlatforms';

export interface PackageRowProps {
  package: Package;
}

export default function PackageRow({ package: pkg }: PackageRowProps) {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row">
        <Box>
          <Style bold type="default">
            {pkg.getName()}
          </Style>
        </Box>

        <Box marginLeft={1}>
          <TargetPlatforms platforms={pkg.config.platforms} target={pkg.config.support} />
        </Box>
      </Box>

      {pkg.artifacts.map((artifact) => (
        <ArtifactRow key={artifact.getLabel()} artifact={artifact} />
      ))}
    </Box>
  );
}
