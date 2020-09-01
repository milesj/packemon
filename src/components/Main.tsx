/* eslint-disable promise/always-return */

import util from 'util';
import React, { useState, useEffect } from 'react';
import { Box, Static } from 'ink';
import { Header, Failure } from '@boost/cli';
import Packemon from '../Packemon';
import { Phase, Build } from '../types';
import BuildList from './BuildList';
import BuildRow from './BuildRow';

const REFRESH_RATE = 100;

const PHASES: { [K in Phase]: string } = {
  find: 'Finding packages',
  build: 'Building %d packages',
  prepare: 'Preparing packages',
};

export interface MainProps {
  packemon: Packemon;
}

export default function Main({ packemon }: MainProps) {
  const [phase, setPhase] = useState<Phase>('find');
  const [builds, setBuilds] = useState<Build[]>([]);
  const [errors, setErrors] = useState<Error[]>([]);
  const [, setCount] = useState(0);

  useEffect(() => {
    if (phase === 'find') {
      const result = packemon.getPackagesAndWorkspaces();

      setBuilds(packemon.generateBuilds(result.packages, result.workspaces));
      setPhase('build');

      // if (packages.length === 0) {
      //   setErrors([new Error('No packages found to build.')]);
      // } else {
      //   setPhase('build');
      // }
    }

    if (phase === 'build') {
      // Set a timer that causes the component to
      // continually render until the build is done
      const timer = setInterval(() => {
        setCount((prev) => prev + 1);
      }, REFRESH_RATE);

      void packemon
        .build(builds)
        .then((result) => {
          if (result.errors.length > 0) {
            setErrors(result.errors);
          } else {
            setPhase('prepare');
          }
        })
        .finally(() => {
          clearInterval(timer);
        });
    }
  }, [packemon, phase, builds]);

  // Group builds based on type
  // TODO store finished builds in state so that Static works correctly
  const finishedBuilds = builds.filter(
    (build) => build.status === 'passed' || build.status === 'failed' || build.status === 'skipped',
  );
  const pendingBuilds = builds.filter((build) => build.status === 'pending');
  const ongoingBuilds = builds.filter((build) => build.status === 'building');

  // Phase label
  let label = util.format(PHASES[phase], ongoingBuilds.length);

  if (pendingBuilds.length > 0) {
    label += ` (${pendingBuilds.length} pending builds)`;
  }

  return (
    <>
      <Static items={finishedBuilds}>
        {(build) => <BuildRow key={build.package.name} build={build} />}
      </Static>

      <Box flexDirection="column">
        {ongoingBuilds.length > 0 && (
          <>
            <Header label={label} />
            <BuildList builds={ongoingBuilds} />
          </>
        )}

        {errors.length > 0 && <Failure error={errors[0]} />}
      </Box>
    </>
  );
}
