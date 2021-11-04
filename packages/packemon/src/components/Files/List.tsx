import React from 'react';
import { Box, Text } from 'ink';
import { Symbol } from './Symbol';

export interface ListProps {
	items: string[];
}

export function List({ items }: ListProps) {
	const lastIndex = items.length - 1;
	const files: string[] = [];
	const folders: string[] = [];

	items
		.sort((a, b) => a.localeCompare(b))
		.forEach((item) => {
			if (item.includes('/') || item.includes('\\')) {
				folders.push(item);
			} else {
				files.push(item);
			}
		});

	return (
		<>
			{[...folders, ...files].map((file, index) => (
				<Box key={file}>
					<Symbol first={index === 0} last={index === lastIndex} />
					<Text>{file}</Text>
				</Box>
			))}
		</>
	);
}
