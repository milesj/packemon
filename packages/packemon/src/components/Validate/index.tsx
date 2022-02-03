import React, { useEffect, useState } from 'react';
import { Box, Static } from 'ink';
import { Header, useProgram, useRenderLoop } from '@boost/cli/react';
import { PackageValidator } from '../../PackageValidator';
import { Packemon } from '../../Packemon';
import { ValidateOptions } from '../../types';
import { useOnMount } from '../hooks/useOnMount';
import { ValidateRow } from './ValidateRow';

export interface ValidateProps extends ValidateOptions {
	packemon: Packemon;
	onValidated?: () => void;
}

export function Validate({ packemon, onValidated, ...options }: ValidateProps) {
	const { exit } = useProgram();
	const clearLoop = useRenderLoop();
	const [isValidating, setIsValidating] = useState(true);
	const [failedValidators, setFailedValidators] = useState<PackageValidator[]>([]);

	// Run the validate process on mount
	useOnMount(() => {
		async function validate() {
			try {
				const validators = await packemon.validate(options);

				setIsValidating(false);
				setFailedValidators(
					validators.filter((validator) => validator.hasErrors() || validator.hasWarnings()),
				);

				onValidated?.();
			} catch (error: unknown) {
				if (error instanceof Error) {
					exit(error);
				}
			} finally {
				clearLoop();
			}
		}

		void validate();

		return clearLoop;
	});

	// Exit validation if there are any errors
	useEffect(() => {
		const errorCount = failedValidators.filter((validator) => validator.hasErrors()).length;
		const errorMessage =
			errorCount === 1
				? `Found errors in ${failedValidators[0].package.getName()} package!`
				: `Found errors in ${errorCount} packages!`;

		if (errorCount > 0) {
			exit(`Validation failed. ${errorMessage}`);
		}
	}, [failedValidators, exit]);

	return (
		<>
			<Static items={failedValidators}>
				{(validator) => (
					<ValidateRow key={`validate-${validator.package.getName()}`} validator={validator} />
				)}
			</Static>

			{!options.quiet && (
				<Box flexDirection="column" margin={0}>
					{isValidating && <Header label="Validating packages" marginBottom={0} />}
				</Box>
			)}
		</>
	);
}
