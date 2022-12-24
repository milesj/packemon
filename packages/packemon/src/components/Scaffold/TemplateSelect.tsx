import { useCallback, useMemo } from 'react';
import { Select, SelectOptionLike } from '@boost/cli/react';
import { TemplateType } from '../../types';

export interface TemplateSelectProps {
	defaultTemplate?: TemplateType;
	onSelect: (template: TemplateType) => void;
}

export function TemplateSelect({ defaultTemplate, onSelect }: TemplateSelectProps) {
	const options = useMemo<SelectOptionLike<TemplateType>[]>(
		() => [
			{ label: 'Monorepo infrastructure (many packages)', value: 'monorepo' },
			{ label: 'Monorepo package', value: 'monorepo-package' },
			{ label: 'Polyrepo (single package)', value: 'polyrepo-package' },
		],
		[],
	);

	const validate = useCallback((value: TemplateType) => {
		if (!value) {
			throw new Error('Please select a template');
		}
	}, []);

	return (
		<Select<TemplateType>
			defaultSelected={defaultTemplate}
			label="Template to scaffold?"
			options={options}
			validate={validate}
			onSubmit={onSelect}
		/>
	);
}
