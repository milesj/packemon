import React from 'react';
import { Style } from '@boost/cli/react';
import { formatMs } from '@boost/common';

export interface DurationProps {
	time: number;
}

export function Duration({ time }: DurationProps) {
	const isFast = time <= 100;

	return <Style type={isFast ? 'muted' : 'default'}>{isFast ? '~' : formatMs(time)}</Style>;
}
