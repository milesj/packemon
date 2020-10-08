import { Static } from 'ink';
import React, { useState, useCallback, useEffect } from 'react';
import Packemon from '../Packemon';
import { Phase } from '../types';
import BootPhase from './BootPhase';
import BuildPhase from './BuildPhase';
import { BuildRow } from './BuildList';
import PackPhase from './PackPhase';

export interface MainProps {
  packemon: Packemon;
}

export default function Main({ packemon }: MainProps) {
  const [phase, setPhase] = useState<Phase | 'done'>('boot');
  const [, setCounter] = useState(0);

  // Continuously re-render so that each build status is updated
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((count) => count + 1);
    }, 100);

    const clear = () => {
      clearInterval(timer);
    };

    packemon.onComplete.listen(clear);

    return clear;
  }, [packemon]);

  // Handlers for advancing between phases
  const handleBooted = useCallback(() => {
    setPhase('build');
  }, []);

  const handleBuilt = useCallback(() => {
    setPhase('pack');
  }, []);

  const handlePacked = useCallback(() => {
    setPhase('done');
  }, []);

  return (
    <>
      {phase === 'boot' && <BootPhase packemon={packemon} onBooted={handleBooted} />}

      {phase === 'build' && <BuildPhase packemon={packemon} onBuilt={handleBuilt} />}

      {phase === 'pack' && <PackPhase packemon={packemon} onPacked={handlePacked} />}

      {phase === 'done' && (
        <Static items={packemon.builds}>
          {(build) => <BuildRow key={build.package.name} build={build} />}
        </Static>
      )}
    </>
  );
}
