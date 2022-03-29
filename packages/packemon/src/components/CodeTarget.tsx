import fileSize from 'filesize';
import { Style } from '@boost/cli/react';
import { Target, TargetProps } from './Target';

export interface CodeTargetProps extends TargetProps {
	stats?: { size: number };
}

export function CodeTarget({ stats, ...props }: CodeTargetProps) {
	return (
		<Target {...props}>
			{stats?.size && <Style type="muted">{` (${fileSize(stats.size)})`}</Style>}
		</Target>
	);
}
