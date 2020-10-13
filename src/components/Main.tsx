import React, { useEffect, useReducer, useRef, useState } from 'react';
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
  const [, forceUpdate] = useReducer((count) => count + 1, 0);
  const [error, setError] = useState<Error>();
  const [staticPackages, setStaticPackages] = useState<Package[]>([]);
  const staticNames = useRef(new Set<string>());

  // Run the packemon process on mount
  useEffect(() => {
    void packemon.run().catch(setError);

    // Continuously re-render on state changes
    packemon.onPhaseChange.listen(forceUpdate);
    packemon.onArtifactUpdate.listen(forceUpdate);
  }, [packemon]);

  // Add complete packages to the static list
  useEffect(() => {
    return packemon.onPackageUpdate.listen((pkg) => {
      if (pkg.isComplete() && !staticNames.current.has(pkg.getName())) {
        setStaticPackages((pkgs) => [...pkgs, pkg]);
        staticNames.current.add(pkg.getName());
      }
    });
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

      {packemon.phase !== 'done' && (
        <Box flexDirection="column">
          <Header label={HEADER_LABELS[packemon.phase]} marginBottom={0} />

          {runningPackages.length > 0 && <PackageList packages={runningPackages} />}
        </Box>
      )}
    </>
  );
}
