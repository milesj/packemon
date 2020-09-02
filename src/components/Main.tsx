import React, { useState, useEffect, useReducer, useCallback } from 'react';
import Packemon from '../Packemon';
import { Phase, Build } from '../types';
import BootPhase from './BootPhase';
import BuildPhase from './BuildPhase';

export interface MainProps {
  packemon: Packemon;
}

export default function Main({ packemon }: MainProps) {
  const [phase, setPhase] = useState<Phase>('boot');
  const [builds, setBuilds] = useState<Build[]>([]);
  const [, forceUpdate] = useReducer((num) => num + 1, 0);

  // Listen to the build process and re-render on each update
  useEffect(() => {
    packemon.onBuildProgress.listen(forceUpdate);

    return () => {
      packemon.onBuildProgress.unlisten(forceUpdate);
    };
  }, [packemon]);

  const handleBooted = useCallback((generatedBuilds: Build[]) => {
    setBuilds(generatedBuilds);
    setPhase('build');
  }, []);

  const handleBuilt = useCallback(() => {
    setPhase('pack');
  }, []);

  return (
    <>
      {phase === 'boot' && <BootPhase packemon={packemon} onBooted={handleBooted} />}

      {phase === 'build' && (
        <BuildPhase packemon={packemon} builds={builds} onBuilt={handleBuilt} />
      )}
    </>
  );
}
