import React from 'react';
import BuildRow from './Row';
import { Build } from '../../types';

export interface BuildListProps {
  builds: Build[];
}

export default function BuildList({ builds }: BuildListProps) {
  return (
    <>
      {builds.map((build) => (
        <BuildRow key={build.package.name} build={build} />
      ))}
    </>
  );
}
