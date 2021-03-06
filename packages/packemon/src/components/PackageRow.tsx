/* eslint-disable react-perf/jsx-no-new-array-as-prop */

import React from 'react';
import { Box } from 'ink';
import { Style } from '@boost/cli/react';
import { Package } from '../Package';
import { Environment as EnvType } from '../types';
import { ArtifactList } from './ArtifactList';
import { Environment } from './Environment';
import { useGroupedArtifacts } from './hooks/useGroupedArtifacts';

export interface PackageRowProps {
	package: Package;
}

export function PackageRow({ package: pkg }: PackageRowProps) {
	const { envs, groups, ungrouped } = useGroupedArtifacts(pkg);

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
						<Environment type={envs[0]} />
					</Box>
				)}
			</Box>

			<ArtifactList artifacts={ungrouped} />

			{Object.entries(groups).map(([env, set]) => (
				<ArtifactList key={env} artifacts={[...set]} environment={env as EnvType} />
			))}
		</Box>
	);
}
