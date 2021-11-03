import React from 'react';
import { Style } from '@boost/cli';

export interface SymbolProps {
	depth: number;
	last: boolean;
}

export function Symbol({ depth, last }: SymbolProps) {
	return (
		<Style type="muted">
			{'│ '.repeat(depth)}
			{last ? '└─ ' : '├─ '}
		</Style>
	);
}
