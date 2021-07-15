/* eslint-disable react/no-array-index-key */

import React from 'react';
import { Box } from 'ink';
import { Style } from '@boost/cli';
import { figures } from '@boost/terminal';
import { PackageValidator } from '../../PackageValidator';

export interface ValidateRowProps {
	validator: PackageValidator;
}

export function ValidateRow({ validator }: ValidateRowProps) {
	return (
		<Box flexDirection="column" marginTop={1}>
			<Box>
				<Style bold type="default">
					{validator.package.getName()}
				</Style>
			</Box>

			{validator.errors.map((error, i) => (
				<Box key={`error-${i}`}>
					<Style type="failure">{` ${figures.bullet} ${error}`}</Style>
				</Box>
			))}

			{validator.warnings.map((warning, i) => (
				<Box key={`warning-${i}`}>
					<Style type="warning">{` ${figures.bullet} ${warning}`}</Style>
				</Box>
			))}
		</Box>
	);
}
