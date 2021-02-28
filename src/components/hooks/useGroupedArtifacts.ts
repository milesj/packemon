import { useMemo } from 'react';
import { Artifact } from '../../Artifact';
import { BundleArtifact } from '../../BundleArtifact';
import { Package } from '../../Package';
import { Environment } from '../../types';

export function useGroupedArtifacts(pkg: Package) {
  return useMemo(() => {
    const ungrouped: Artifact[] = [];
    let groups: Partial<Record<Environment, Set<Artifact>>> = {};

    // Group artifacts by platform and support
    pkg.artifacts.forEach((artifact) => {
      if (artifact instanceof BundleArtifact) {
        const key = `${artifact.platform}:${artifact.support}` as Environment;
        const set = groups[key] || new Set();

        set.add(artifact);
        groups[key] = set;
      } else {
        ungrouped.push(artifact);
      }
    });

    // If only 1 group, collapse into a single target
    const envs = Object.keys(groups) as Environment[];

    if (envs.length === 1) {
      ungrouped.unshift(...Array.from(groups[envs[0]]!));
      groups = {};
    }

    return {
      envs,
      groups,
      ungrouped,
    };
  }, [pkg]);
}
