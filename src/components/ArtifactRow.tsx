import React from 'react';
import { Box } from 'ink';
import Spinner from 'ink-spinner';
import { Style } from '@boost/cli';
import { Artifact } from '../Artifact';
import { CodeArtifact } from '../CodeArtifact';
import { STATE_LABELS } from '../constants';
import { CodeTarget } from './CodeTarget';
import { Duration } from './Duration';
import { Target } from './Target';

export interface ArtifactRowProps {
	artifact: Artifact;
}

export function ArtifactRow({ artifact }: ArtifactRowProps) {
	return (
		<Box flexDirection="row" paddingLeft={1}>
			{artifact.getBuildTargets().map((target, index) => {
				const props = {
					target,
					state: artifact.state,
				};

				if (artifact instanceof CodeArtifact) {
					return <CodeTarget key={target} {...props} stats={artifact.builds[index].stats} />;
				}

				return <Target key={target} {...props} />;
			})}

			<Box marginLeft={1}>
				{artifact.isComplete() ? (
					<Duration time={artifact.buildResult.time} />
				) : (
					<Style type="muted">{STATE_LABELS[artifact.state]}</Style>
				)}
			</Box>

			{artifact.isRunning() && (
				<Box marginLeft={1}>
					<Style type="warning">
						<Spinner type="dots" />
					</Style>
				</Box>
			)}
		</Box>
	);
}
