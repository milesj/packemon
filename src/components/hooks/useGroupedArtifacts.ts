import { useMemo } from 'react';
import Artifact from '../../Artifact';
import BundleArtifact from '../../BundleArtifact';
import Package from '../../Package';

export default function useGroupedArtifacts(pkg: Package) {
  return useMemo(() => {
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

    return {
      envs,
      groups,
      ungrouped,
    };
  }, [pkg]);
}
