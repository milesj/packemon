import React, { useCallback, useMemo } from 'react';
import { Select, SelectOptionLike } from '@boost/cli/react';
import { Template } from '../../types';

export interface TemplateSelectProps {
	onSelect: (template: Template) => void;
}

export function TemplateSelect({ onSelect }: TemplateSelectProps) {
	const options = useMemo<SelectOptionLike<Template>[]>(
		() => [
			{ label: 'Monorepo infrastructure (many packages)', value: 'monorepo' },
			{ label: 'Monorepo package', value: 'monorepo-package' },
			{ label: 'Polyrepo infrastructure (single package)', value: 'polyrepo' },
			{ label: 'Polyrepo package', value: 'polyrepo-package' },
		],
		[],
	);

	const validate = useCallback((value: Template) => {
		if (!value) {
			throw new Error('Please select a template');
		}
	}, []);

	return (
		<Select<Template>
			defaultSelected="monorepo"
			label="Template to scaffold?"
			options={options}
			validate={validate}
			onSubmit={onSelect}
		/>
	);
}
