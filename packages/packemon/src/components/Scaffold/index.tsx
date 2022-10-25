/* eslint-disable react/jsx-no-literals */

import { useCallback, useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Input, useProgram } from '@boost/cli/react';
import { isModuleName } from '@boost/common';
import { ScaffoldParams, TemplateType } from '../../types';
import { TemplateSelect } from './TemplateSelect';

export interface ScaffoldProps {
	defaultTemplate?: TemplateType;
	onComplete: (params: ScaffoldParams) => Promise<unknown>;
}

export function Scaffold({ defaultTemplate, onComplete }: ScaffoldProps) {
	const { exit } = useProgram();
	const [template, setTemplate] = useState<TemplateType>();
	const [packageName, setPackageName] = useState<string>('');
	const [projectName, setProjectName] = useState<string>('');
	const [repoUrl, setRepoUrl] = useState<string>('');
	const [author, setAuthor] = useState<string>('');
	const [running, setRunning] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line complexity
		async function complete() {
			if (!template) {
				return;
			}

			// Project validation
			if ((template === 'monorepo' || template === 'polyrepo') && (!projectName || !author)) {
				return;
			}

			// Package validation
			if (
				(template === 'monorepo-package' || template === 'polyrepo-package') &&
				(!packageName || !author || !repoUrl)
			) {
				return;
			}

			try {
				setRunning(true);

				await onComplete({
					author,
					template,
					repoUrl,
					packageName: packageName || projectName,
					projectName: projectName || `${packageName}-root`,
					year: new Date().getFullYear(),
				});
			} catch (error: unknown) {
				exit(error as Error);
			} finally {
				setRunning(false);
				exit();
			}
		}

		void complete();
	}, [author, template, packageName, projectName, repoUrl, onComplete, exit]);

	const validatePackageName = useCallback((value: string) => {
		if (!value || !value.trim() || !isModuleName(value)) {
			throw new Error('Please provide a valid npm package name');
		}
	}, []);

	const validateProjectName = useCallback((value: string) => {
		if (!value || !value.trim() || !isModuleName(value)) {
			throw new Error('Please provide a valid project name (alphanumeric characters and dashes)');
		}
	}, []);

	const validateRepoUrl = useCallback((value: string) => {
		if (!value || !value.trim() || (!value.startsWith('http') && !value.startsWith('git@'))) {
			throw new Error('Please provide a valid repository URL (https or git)');
		}
	}, []);

	const validateAuthor = useCallback((value: string) => {
		if (!value || !value.trim()) {
			throw new Error('Please provide an author or company name');
		}
	}, []);

	if (running) {
		return (
			<Box flexDirection="column">
				<Text>Scaffolding {template}...</Text>
			</Box>
		);
	}

	const isPackage = template === 'monorepo-package' || template === 'polyrepo-package';

	return (
		<Box flexDirection="column">
			<TemplateSelect defaultTemplate={defaultTemplate} onSelect={setTemplate} />

			<Input
				label="Author?"
				placeholder="Your name, company name, ..."
				validate={validateAuthor}
				onSubmit={setAuthor}
			/>

			{isPackage ? (
				<Input label="Package name?" validate={validatePackageName} onSubmit={setPackageName} />
			) : (
				<Input label="Project name?" validate={validateProjectName} onSubmit={setProjectName} />
			)}

			{isPackage && (
				<Input label="Repository URL?" validate={validateRepoUrl} onSubmit={setRepoUrl} />
			)}
		</Box>
	);
}
