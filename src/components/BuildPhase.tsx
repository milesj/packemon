import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { Header } from '@boost/cli';
import BuildList from './BuildList';
import Packemon from '../Packemon';
import Build from '../Build';

export interface BuildPhaseProps {
  packemon: Packemon;
  onBuilt: () => void;
}

export default function BuildPhase({ packemon, onBuilt }: BuildPhaseProps) {
  const [errors, setErrors] = useState<Error[]>([]);

  // Start building packages on mount
  useEffect(() => {
    void packemon.build().then((result) => {
      if (result.errors.length > 0) {
        setErrors(result.errors);
      } else {
        onBuilt();
      }
    });
  }, [packemon, onBuilt]);

  // Bubble up errors to the main application
  if (errors.length > 0) {
    throw errors[0];
  }

  // Update and sort build list states
  const pendingBuilds: Build[] = [];
  const runningBuilds: Build[] = [];

  packemon.builds.forEach((build) => {
    if (build.status === 'building') {
      runningBuilds.push(build);
    } else if (build.status === 'pending') {
      pendingBuilds.push(build);
    }
  });

  // Phase label
  let label = `Building ${runningBuilds.length} packages`;

  if (pendingBuilds.length > 0) {
    label += ` (${pendingBuilds.length} pending)`;
  }

  return (
    <Box flexDirection="column">
      <Header label={label} marginBottom={0} />
      <BuildList builds={runningBuilds} />
    </Box>
  );
}
