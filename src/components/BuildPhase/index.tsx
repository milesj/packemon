import React, { useEffect, useState } from 'react';
import { Box, Static } from 'ink';
import { Header } from '@boost/cli';
import BuildRow from './Row';
import BuildList from './List';
import Packemon from '../../Packemon';
import Build from '../../Build';

export interface BuildPhaseProps {
  builds: Build[];
  packemon: Packemon;
  onBuilt: () => void;
}

export default function BuildPhase({ builds, packemon, onBuilt }: BuildPhaseProps) {
  const [errors, setErrors] = useState<Error[]>([]);

  // Start building packages on mount
  useEffect(() => {
    void packemon.build(builds).then((result) => {
      if (result.errors.length > 0) {
        setErrors(result.errors);
      } else {
        onBuilt();
      }
    });
  }, [packemon, builds, onBuilt]);

  // Update and sort build list states
  const finishedBuilds: Build[] = [];
  const pendingBuilds: Build[] = [];
  const runningBuilds: Build[] = [];

  builds.forEach((build) => {
    if (build.status === 'passed' || build.status === 'failed' || build.status === 'skipped') {
      finishedBuilds.push(build);
    } else if (build.status === 'building') {
      runningBuilds.push(build);
    } else {
      pendingBuilds.push(build);
    }
  });

  // Bubble up errors to the main application
  if (errors.length > 0) {
    throw errors[0];
  }

  // Phase label
  let label = `Building ${runningBuilds.length} packages`;

  if (pendingBuilds.length > 0) {
    label += ` (${pendingBuilds.length} pending)`;
  }

  return (
    <>
      <Static items={finishedBuilds}>
        {(build) => <BuildRow key={build.package.name} build={build} />}
      </Static>

      <Box flexDirection="column">
        <Header label={label} />
        <BuildList builds={runningBuilds} />
      </Box>
    </>
  );
}
