import React, { useEffect, useState } from 'react';
import { useProgram, Header } from '@boost/cli';
import Packemon from '../Packemon';
import { BuildOptions } from '../types';
import Build from './Build';
import Validate from './Validate';

export interface PackProps extends BuildOptions {
  packemon: Packemon;
}

export default function Pack({ packemon, ...options }: PackProps) {
  const { exit } = useProgram();
  const [phase, setPhase] = useState('clean');

  // Start the clean process first
  useEffect(() => {
    void packemon
      .clean()
      .then(() => {
        setPhase('build');
      })
      .catch(exit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {phase === 'clean' && <Header label="Cleaning packages" />}

      {phase === 'build' && (
        <Build
          {...options}
          packemon={packemon}
          onBuilt={() => {
            setPhase('validate');
          }}
        />
      )}

      {phase === 'validate' && (
        <Validate
          packemon={packemon}
          onValidated={() => {
            setPhase('packed');
          }}
        />
      )}
    </>
  );
}
