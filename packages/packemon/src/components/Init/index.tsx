import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Text } from 'ink';
import { Header, Style, useProgram } from '@boost/cli';
import { PackemonPackageConfig } from '../../types';
import { PackageForm } from './PackageForm';

export type InitPackageConfigs = Record<string, PackemonPackageConfig>;

export interface InitProps {
	packageNames: string[];
	onComplete: (configs: InitPackageConfigs) => Promise<unknown>;
}

export function Init({ packageNames, onComplete }: InitProps) {
	const { exit } = useProgram();
	const [pkgsToConfigure, setPkgsToConfigure] = useState(() => packageNames);
	const [pkgConfigs, setPkgConfigs] = useState<InitPackageConfigs>({});
	const currentPkg = useMemo(() => pkgsToConfigure[0], [pkgsToConfigure]);

	// Save config and move to next package
	const handleSubmit = useCallback(
		(config: PackemonPackageConfig) => {
			setPkgConfigs((prev) => ({
				...prev,
				[currentPkg]: config,
			}));

			setPkgsToConfigure((prev) => prev.slice(1));
		},
		[currentPkg],
	);

	// Complete once all packages have been configured
	useEffect(() => {
		async function complete() {
			if (pkgsToConfigure.length > 0) {
				return;
			}

			try {
				await onComplete(pkgConfigs);
			} finally {
				exit();
			}
		}

		void complete();
	}, [pkgsToConfigure, pkgConfigs, onComplete, exit]);

	// Exit when theres no packages
	if (pkgsToConfigure.length === 0) {
		return null;
	}

	return (
		<Box flexDirection="column">
			<Header label="Initializing packages" />

			<Box>
				<Text>
					<Text bold>Packages to configure: </Text>
					<Style type="notice">{currentPkg}</Style>
					{pkgsToConfigure.length > 1 && `, ${pkgsToConfigure.slice(1).join(', ')}`}
				</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				<PackageForm key={currentPkg} onSubmit={handleSubmit} />
			</Box>
		</Box>
	);
}
