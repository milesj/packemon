/* eslint-disable react-perf/jsx-no-new-array-as-prop */

import React from 'react';
import { Box, Static } from 'ink';
import { Header } from '@boost/cli';
import { List } from './List';
import { FileTree, Tree } from './Tree';

export type FileFormat = 'list' | 'tree';

export interface FilesProps {
	format: FileFormat;
	list: string[];
	name: string;
	tree: FileTree;
}

export function Files({ format, list, name, tree }: FilesProps) {
	if (format === 'list') {
		return (
			<Static items={[list]}>
				{(root) => (
					<Box key="root" flexDirection="column">
						<Header label={name} />
						<List items={root} />
					</Box>
				)}
			</Static>
		);
	}

	return (
		<Static items={[tree]}>
			{(root) => (
				<Box key="root" flexDirection="column">
					<Header label={name} />
					<Tree depth={0} tree={root} />
				</Box>
			)}
		</Static>
	);
}
