import React, { useEffect, useState } from 'react';
import { Box, Static } from 'ink';
import { Header } from '@boost/cli';
import Packemon from '../Packemon';
import PackageList from './PackageList';
import PackageRow from './PackageRow';
import Package from '../Package';

const HEADER_LABELS = {
  boot: 'Bootstrapping packages',
  build: 'Building package artifacts',
  pack: 'Packing for distribution',
};

export interface MainProps {
  packemon: Packemon;
}

export default function Main({ packemon }: MainProps) {
  const [error, setError] = useState<Error>();
  const [counter, setCounter] = useState(0);
  const [builtPackages, setBuiltPackages] = useState<Package[]>([]);

  useEffect(() => {
    // Continuously re-render so that states are updated
    const timer = setInterval(() => {
      setCounter((count) => count + 1);
    }, 50);

    const clear = () => {
      clearInterval(timer);
    };

    // Run the packemon process on mount
    void packemon
      .run()
      .then(() => {
        // Give some time for the static elements to flush
        setTimeout(clear, 150);
      })
      .catch(setError);

    return clear;
  }, [packemon]);

  // Update built packages list on each re-render
  useEffect(() => {
    setBuiltPackages((prevBuilt) => {
      const builtSet = new Set(prevBuilt);
      const nextBuilt: Package[] = [];

      packemon.packages.forEach((pkg) => {
        if (pkg.isBuilt() && !builtSet.has(pkg)) {
          nextBuilt.push(pkg);
        }
      });

      return [...prevBuilt, ...nextBuilt];
    });
  }, [counter, packemon]);

  // Bubble up errors to the program
  if (error) {
    throw error;
  }

  const runningPackages = packemon.packages.filter((pkg) => !pkg.isBuilt());

  return (
    <>
      <Static items={builtPackages}>
        {(pkg) => <PackageRow key={pkg.getName()} package={pkg} />}
      </Static>

      {packemon.phase !== 'done' && (
        <Box flexDirection="column">
          <Header label={HEADER_LABELS[packemon.phase]} marginBottom={0} />

          {runningPackages.length > 0 && <PackageList packages={runningPackages} />}
        </Box>
      )}
    </>
  );
}
