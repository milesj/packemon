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
  const [finishedBuilds, setFinishedBuilds] = useState<Build[]>([]);
  const [pendingBuilds, setPendingBuilds] = useState<Build[]>(builds);
  const [runningBuilds, setRunningBuilds] = useState<Build[]>([]);

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

  // Update build list states
  useEffect(() => {
    const sortBuilds = (buildList: Build[]) => {
      const finished: Build[] = [];
      const pending: Build[] = [];
      const running: Build[] = [];

      buildList.forEach((build) => {
        if (build.status === 'passed' || build.status === 'failed' || build.status === 'skipped') {
          finished.push(build);
        } else if (build.status === 'building') {
          running.push(build);
        } else {
          pending.push(build);
        }
      });

      setFinishedBuilds(finished);
      setPendingBuilds(pending);
      setRunningBuilds(running);
    };

    packemon.onBuildProgress.listen(sortBuilds);

    return () => {
      packemon.onBuildProgress.unlisten(sortBuilds);
    };
  }, [packemon]);

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
