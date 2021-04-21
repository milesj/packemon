import React, { useCallback, useState } from 'react';
import { useProgram } from '@boost/cli';
import { Packemon } from '../../Packemon';
import { BuildOptions } from '../../types';
import { Build } from '../Build';
import { useOnMount } from '../hooks/useOnMount';
import { Validate } from '../Validate';

export interface PackProps extends BuildOptions {
  packemon: Packemon;
}

export function Pack({ packemon, ...options }: PackProps) {
  const { exit } = useProgram();
  const [phase, setPhase] = useState('clean');

  const handleBuilt = useCallback(() => {
    setPhase('validate');
  }, []);

  const handleValidated = useCallback(() => {
    setPhase('packed');
  }, []);

  // Start the clean process first
  useOnMount(() => {
    async function clean() {
      try {
        await packemon.clean();
        setPhase('build');
      } catch (error: unknown) {
        if (error instanceof Error) {
          exit(error);
        }
      }
    }

    void clean();
  });

  return (
    <>
      {phase === 'build' && <Build {...options} packemon={packemon} onBuilt={handleBuilt} />}

      {phase === 'validate' && <Validate packemon={packemon} onValidated={handleValidated} />}
    </>
  );
}
