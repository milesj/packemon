import React from 'react';
import { Box } from 'ink';
import { Style } from '@boost/cli';
import Artifact from '../Artifact';
import BundleArtifact from '../BundleArtifact';
import Package from '../Package';
import ArtifactList from './ArtifactList';
import Environment from './Environment';

export interface PackageRowProps {
  package: Package;
}

export default function PackageRow({ package: pkg }: PackageRowProps) {
  const ungrouped: Artifact[] = [];
  let groups: Record<string, Set<Artifact>> = {};

  // Group artifacts by platform and support
  pkg.artifacts.forEach((artifact) => {
    if (artifact instanceof BundleArtifact) {
      artifact.builds.forEach((build) => {
        const key = `${build.platform}:${build.support}`;
        const set = groups[key] || new Set();

        set.add(artifact);
        groups[key] = set;
      });
    } else {
      ungrouped.push(artifact);
    }
  });

  // If only 1 group, collapse into a single target
  const envs = Object.keys(groups);

  if (envs.length === 1) {
    ungrouped.unshift(...Array.from(groups[envs[0]]));
    groups = {};
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row">
        <Box>
          <Style bold type="default">
            {pkg.getName()}
          </Style>
        </Box>

        {envs.length === 1 && (
          <Box marginLeft={1}>
            <Environment target={envs[0]} />
          </Box>
        )}
      </Box>

      <ArtifactList artifacts={ungrouped} />

      {Object.entries(groups).map(([env, set]) => (
        <ArtifactList key={env} artifacts={Array.from(set)} environment={env} />
      ))}
    </Box>
  );
}
