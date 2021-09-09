import React, { useCallback, useEffect, useState } from 'react';
import { Box } from 'ink';
import { Input, useProgram } from '@boost/cli/react';
import { isModuleName } from '@boost/common';
import { ScaffoldParams, Template } from '../../types';
import { TemplateSelect } from './TemplateSelect';

export interface ScaffoldProps {
	onComplete: (params: ScaffoldParams) => Promise<unknown>;
}

export function Scaffold({ onComplete }: ScaffoldProps) {
	const { exit } = useProgram();
	const [template, setTemplate] = useState<Template>();
	const [packageName, setPackageName] = useState<string>('');
	const [projectName, setProjectName] = useState<string>('');
	const [repoUrl, setRepoUrl] = useState<string>('');
	const [author, setAuthor] = useState<string>('');

	useEffect(() => {
		async function complete() {
			if (!template || !repoUrl || !(packageName || projectName) || !author) {
				return;
			}

			try {
				await onComplete({
					author,
					template,
					repoUrl,
					packageName,
					projectName: projectName ?? `${packageName}-root`,
					year: new Date().getFullYear(),
				});
			} catch (error: unknown) {
				exit(error as Error);
			} finally {
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

	const isPackage = template === 'monorepo-package' || template === 'polyrepo-package';

	return (
		<Box flexDirection="column">
			<TemplateSelect onSelect={setTemplate} />

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
