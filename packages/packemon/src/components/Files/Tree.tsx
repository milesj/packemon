import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { Style, StyleType } from '@boost/cli';
import { Symbol } from './Symbol';
import { TreeContext, useTree } from './TreeContext';

const FOLDER_COLOR: Record<string, StyleType> = {
	src: 'notice',
	// Node.js
	cjs: 'success',
	mjs: 'success',
	// JavaScript
	lib: 'warning',
	esm: 'warning',
	umd: 'warning',
	// TypeScript
	dts: 'info',
};

export interface FileTree {
	files?: string[];
	folders?: Record<string, FileTree>;
}

interface FileListProps {
	depth: number;
	files: string[];
}

function FileList({ depth, files }: FileListProps) {
	const { lastIndex } = useTree()!;

	return (
		<>
			{files.map((file, index) => (
				<Box key={file + String(depth)}>
					<Symbol depth={depth} last={lastIndex[0] === 'file' && lastIndex[1] === index} />
					<Text>{file}</Text>
				</Box>
			))}
		</>
	);
}

interface FolderListProps {
	depth: number;
	folders: [string, FileTree][];
}

function FolderList({ depth, folders }: FolderListProps) {
	const { folderStyle, lastIndex } = useTree()!;

	return (
		<>
			{folders.map(([folder, tree], index) => {
				const style = folderStyle ?? FOLDER_COLOR[folder] ?? 'failure';

				return (
					<Box key={folder + String(depth)} flexDirection="column">
						<Box>
							<Symbol depth={depth} last={lastIndex[0] === 'folder' && lastIndex[1] === index} />

							<Style bold type={style}>
								{folder}
							</Style>
						</Box>

						{/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
						<Tree depth={depth + 1} style={style} tree={tree} />
					</Box>
				);
			})}
		</>
	);
}

export interface TreeProps {
	depth: number;
	tree: FileTree;
	style?: StyleType;
}

export function Tree({ depth, tree, style }: TreeProps) {
	const files = (tree.files ?? []).sort((a, b) => a.localeCompare(b));
	const folders = Object.entries(tree.folders ?? {}).sort((a, b) => a[0].localeCompare(b[0]));

	const value = useMemo(
		() => ({
			folderStyle: style,
			lastIndex: (files.length > 0
				? ['file', files.length - 1]
				: ['folder', folders.length - 1]) as [string, number],
		}),
		[files, folders, style],
	);

	return (
		<TreeContext.Provider value={value}>
			<Box flexDirection="column">
				{folders.length > 0 && <FolderList depth={depth} folders={folders} />}

				{files.length > 0 && <FileList depth={depth} files={files} />}
			</Box>
		</TreeContext.Provider>
	);
}
