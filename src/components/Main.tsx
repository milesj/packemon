import React, { useState, useCallback } from 'react';
import Build from '../Build';
import Packemon from '../Packemon';
import { Phase } from '../types';
import BootPhase from './BootPhase';
import BuildPhase from './BuildPhase';

export interface MainProps {
  packemon: Packemon;
}

export default function Main({ packemon }: MainProps) {
  const [phase, setPhase] = useState<Phase>('boot');
  const [builds, setBuilds] = useState<Build[]>([]);

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
