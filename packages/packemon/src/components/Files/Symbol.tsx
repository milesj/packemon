import React from 'react';
import { Style } from '@boost/cli';

export interface SymbolProps {
	depth?: boolean[];
	first: boolean;
	last: boolean;
}

export function Symbol({ depth = [], first, last }: SymbolProps) {
	return (
		<Style type="muted">
			{depth.map((d) => (d ? '│ ' : '  ')).join('')}

			{/* eslint-disable-next-line no-nested-ternary */}
			{first ? '┌─ ' : last ? '└─ ' : '├─ '}
		</Style>
	);
}
