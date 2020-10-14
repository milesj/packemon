import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Box, Static } from 'ink';
import { Header } from '@boost/cli';
import Packemon from '../Packemon';
import PackageList from './PackageList';
import PackageRow from './PackageRow';
import Package from '../Package';

export interface DistributeProps {
  packemon: Packemon;
}

export default function Distribute({ packemon }: DistributeProps) {
  const [, forceUpdate] = useReducer((count) => count + 1, 0);
  const [error, setError] = useState<Error>();
  const [staticPackages, setStaticPackages] = useState<Package[]>([]);
  const staticNames = useRef(new Set<string>());

  useEffect(() => {
    // Continuously render at 30 FPS
    const timer = setInterval(forceUpdate, 1000 / 30);
    const clear = () => clearInterval(timer);

    // Run the packemon process on mount
    void packemon.run().catch(setError).finally(clear);

    // Add complete packages to the static list
    const unlisten = packemon.onPackagePrepared.listen((pkg) => {
      if (pkg.isComplete() && !staticNames.current.has(pkg.getName())) {
        setStaticPackages((pkgs) => [...pkgs, pkg]);
        staticNames.current.add(pkg.getName());
      }
    });

    return () => {
      clear();
      unlisten();
    };
  }, [packemon]);

  // Bubble up errors to the program
  if (error) {
    throw error;
  }

  const runningPackages = packemon.packages.filter((pkg) => pkg.isRunning());

  return (
    <>
      <Static items={staticPackages}>
        {(pkg) => <PackageRow key={pkg.getName()} package={pkg} />}
      </Static>

      {runningPackages.length > 0 && (
        <Box flexDirection="column">
          <Header label="Preparing packages for distribution" marginBottom={0} />
          <PackageList packages={runningPackages} />
        </Box>
      )}
    </>
  );
}
