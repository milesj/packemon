import React from 'react';
import { Style } from '@boost/cli';

export interface SymbolProps {
	depth?: boolean[];
	last: boolean;
}

export function Symbol({ depth = [], last }: SymbolProps) {
	return (
		<Style type="muted">
			{depth.map((d) => (d ? '│ ' : '  ')).join('')}
			{last ? '└─ ' : '├─ '}
		</Style>
	);
}
