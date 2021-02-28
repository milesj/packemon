import React, { useRef, useState } from 'react';
import { Box, Static } from 'ink';
import { Header, useProgram, useRenderLoop } from '@boost/cli';
import { Package } from '../../Package';
import { Packemon } from '../../Packemon';
import { BuildOptions } from '../../types';
import { useOnMount } from '../hooks/useOnMount';
import { PackageList } from '../PackageList';
import { PackageRow } from '../PackageRow';

export interface BuildProps extends BuildOptions {
  packemon: Packemon;
  onBuilt?: () => void;
}

export function Build({ packemon, onBuilt, ...options }: BuildProps) {
  const { exit } = useProgram();
  const [packages, setPackages] = useState<Package[]>([]);
  const [staticPackages, setStaticPackages] = useState<Package[]>([]);
  const staticNames = useRef(new Set<string>()).current;
  const clearLoop = useRenderLoop();

  useOnMount(() => {
    let pkgCount = 0;

    // Save loaded packages
    packemon.onPackagesLoaded.once((pkgs) => {
      setPackages(pkgs);
      pkgCount = pkgs.length;
    });

    // Add built package to the static list
    const unlistenBuilt = packemon.onPackageBuilt.listen((pkg) => {
      if (pkg.isComplete() && !staticNames.has(pkg.getName())) {
        setStaticPackages((pkgs) => [...pkgs, pkg]);
        staticNames.add(pkg.getName());
      }

      if (staticNames.size === pkgCount) {
        clearLoop();
      }
    });

    // Run the build process on mount
    void packemon
      .build(options)
      .then(() => {
        unlistenBuilt();

        setStaticPackages((prev) =>
          prev.concat(
            packages.filter((pkg) => pkg.isComplete() && !staticNames.has(pkg.getName())),
          ),
        );

        onBuilt?.();
      })
      .catch(exit)
      .finally(clearLoop);
  });

  const runningPackages = packages.filter((pkg) => pkg.isRunning());

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
