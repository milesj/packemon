import React from 'react';
import { useDimensions } from '@boost/cli';
import { Package } from '../Package';
import { PackageRow } from './PackageRow';

export interface PackageListProps {
  packages: Package[];
}

export function PackageList({ packages }: PackageListProps) {
  const { height } = useDimensions();

  // We dont want to show more packages than the amount of rows available in the terminal
  const visiblePackages: Package[] = [];
  let currentHeight = 0;

  packages
    .filter((pkg) => pkg.isRunning())
    .some((pkg) => {
      // margin (2) + name row (1) + artifacts (n)
      const rowHeight = 3 + pkg.artifacts.length;

      // Not enough room to display another row
      if (currentHeight + rowHeight > height) {
        return true;
      }

      visiblePackages.push(pkg);
      currentHeight += rowHeight;

      return false;
    });

  if (visiblePackages.length === 0) {
    return null;
  }

  return (
    <>
      {visiblePackages.map((pkg) => (
        <PackageRow key={`build-${pkg.getName()}`} package={pkg} />
      ))}
    </>
  );
}
