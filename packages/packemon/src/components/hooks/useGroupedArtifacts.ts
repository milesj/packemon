import { useMemo } from 'react';
import { Artifact } from '../../Artifact';
import { CodeArtifact } from '../../CodeArtifact';
import { Package } from '../../Package';
import { Environment } from '../../types';

export function useGroupedArtifacts(pkg: Package) {
	return useMemo(() => {
		const ungrouped: Artifact[] = [];
		let groups: Partial<Record<Environment, Set<Artifact>>> = {};

		// Group artifacts by platform and support
		pkg.artifacts.forEach((artifact) => {
			if (artifact instanceof CodeArtifact) {
				const key = `${artifact.platform}:${artifact.support}`;
				const set = groups[key as Environment] ?? new Set();

				set.add(artifact);
				groups[key as Environment] = set;
			} else {
				ungrouped.push(artifact);
			}
		});

		// If only 1 group, collapse into a single target
		const envs = Object.keys(groups) as Environment[];

		if (envs.length === 1) {
			ungrouped.unshift(...groups[envs[0]]!);
			groups = {};
		}

		return {
			envs,
			groups,
			ungrouped,
		};
	}, [pkg]);
}
