/* eslint-disable react-perf/jsx-no-new-array-as-prop */

import React from 'react';
import { Box, Static } from 'ink';
import { Header } from '@boost/cli';
import { FileTree, Tree } from './Tree';

export interface FilesProps {
	name: string;
	tree: FileTree;
}

export function Files({ name, tree }: FilesProps) {
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
