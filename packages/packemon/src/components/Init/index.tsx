/* eslint-disable react/jsx-no-literals */

import { useCallback } from 'react';
import { Box, Text } from 'ink';
import { Header, Style, useProgram } from '@boost/cli/react';
import { PackemonPackageConfig } from '../../types';
import { PackageForm } from './PackageForm';

export type InitPackageConfigs = Record<string, PackemonPackageConfig>;

export interface InitProps {
	packageName: string;
	onComplete: (config: PackemonPackageConfig) => Promise<unknown>;
}

export function Init({ packageName, onComplete }: InitProps) {
	const { exit } = useProgram();

	const handleSubmit = useCallback(
		(config: PackemonPackageConfig) => {
			async function complete() {
				try {
					await onComplete(config);
				} catch (error: unknown) {
					exit(error as Error);
				} finally {
					exit();
				}
			}

			void complete();
		},
		[exit, onComplete],
	);

	return (
		<Box flexDirection="column">
			<Header label="Initializing package" />

			<Box>
				<Text>
					<Text bold>Package to configure: </Text>
					<Style type="notice">{packageName}</Style>
				</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				<PackageForm key={packageName} onSubmit={handleSubmit} />
			</Box>
		</Box>
	);
}
