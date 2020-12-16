import React, { useRef, useState } from 'react';
import { Box, Static } from 'ink';
import { Header, useProgram, useRenderLoop } from '@boost/cli';
import Packemon from '../../Packemon';
import PackageList from '../PackageList';
import PackageRow from '../PackageRow';
import Package from '../../Package';
import { BuildOptions } from '../../types';
import useOnMount from '../hooks/useOnMount';

export interface BuildProps extends BuildOptions {
  packemon: Packemon;
  onBuilt?: () => void;
}

export default function Build({ packemon, onBuilt, ...options }: BuildProps) {
  const { exit } = useProgram();
  const [staticPackages, setStaticPackages] = useState<Package[]>([]);
  const staticNames = useRef(new Set<string>());
  const clearLoop = useRenderLoop();

  // Run the build process on mount
  useOnMount(() => {
    void packemon.build(options).then(onBuilt).catch(exit).finally(clearLoop);

    // Add complete packages to the static list
    const unlisten = packemon.onPackageBuilt.listen((pkg) => {
      if (pkg.isComplete() && !staticNames.current.has(pkg.getName())) {
        setStaticPackages((pkgs) => [...pkgs, pkg]);
        staticNames.current.add(pkg.getName());
      }
    });

    return () => {
      clearLoop();
      unlisten();
    };
  });

  const runningPackages = packemon.packages.filter((pkg) => pkg.isRunning());

  return (
    <>
      <Static items={staticPackages}>
        {(pkg) => <PackageRow key={`static-build-${pkg.getName()}`} package={pkg} />}
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
