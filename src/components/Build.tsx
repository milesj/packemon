import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Box, Static } from 'ink';
import { Header } from '@boost/cli';
import Packemon from '../Packemon';
import PackageList from './PackageList';
import PackageRow from './PackageRow';
import Package from '../Package';
import { BuildOptions } from '../types';

export interface BuildProps extends Required<BuildOptions> {
  packemon: Packemon;
}

export default function Build({ packemon, ...options }: BuildProps) {
  const [, forceUpdate] = useReducer((count) => count + 1, 0);
  const [error, setError] = useState<Error>();
  const [staticPackages, setStaticPackages] = useState<Package[]>([]);
  const staticNames = useRef(new Set<string>());

  useEffect(() => {
    // Continuously render at 30 FPS
    const timer = setInterval(forceUpdate, 1000 / 30);
    const clear = () => clearInterval(timer);

    // Run the packemon process on mount
    void packemon.build(options).catch(setError).finally(clear);

    // Add complete packages to the static list
    const unlisten = packemon.onPackageBuilt.listen((pkg) => {
      if (pkg.isComplete() && !staticNames.current.has(pkg.getName())) {
        setStaticPackages((pkgs) => [...pkgs, pkg]);
        staticNames.current.add(pkg.getName());
      }
    });

    return () => {
      clear();
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Header label="Building packages for distribution" marginBottom={0} />
          <PackageList packages={runningPackages} />
        </Box>
      )}
    </>
  );
}
