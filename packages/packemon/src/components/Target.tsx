import { Box } from 'ink';
import { Style } from '@boost/cli/react';
import { figures } from '@boost/terminal';
import { STATE_COLORS } from '../constants';
import { ArtifactState } from '../types';

export interface TargetProps {
	target: string;
	children?: React.ReactNode;
	state?: ArtifactState;
}

export function Target({ target, children, state = 'pending' }: TargetProps) {
	return (
		<Box marginLeft={1}>
			<Style bold type={STATE_COLORS[state] ?? 'default'}>
				{state === 'failed' ? figures.cross : figures.squareSmallFilled} {target.toLowerCase()}
			</Style>

			{children}
		</Box>
	);
}
