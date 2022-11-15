import { useCallback, useEffect, useMemo, useState } from 'react';
import { applyStyle } from '@boost/cli';
import { Input, MultiSelect, Select, SelectOptionLike } from '@boost/cli/react';
import { toArray } from '@boost/common';
import {
	BROWSER_TARGETS,
	DEFAULT_FORMATS,
	DEFAULT_INPUT,
	DEFAULT_SUPPORT,
	ELECTRON_TARGETS,
	NATIVE_TARGETS,
	NODE_SUPPORTED_VERSIONS,
} from '../../constants';
import { Format, PackemonPackageConfig, Platform, Support } from '../../types';

export interface PackageFormProps {
	onSubmit: (config: PackemonPackageConfig) => void;
}

export function getVersionsCombo(platforms: Platform[], support: Support): Set<string> {
	const versions = new Set<string>();

	platforms.forEach((platform) => {
		switch (platform) {
			case 'native':
				versions.add(`Native (${NATIVE_TARGETS[support]}+)`);
				break;

			case 'node':
				versions.add(`Node v${NODE_SUPPORTED_VERSIONS[support]}+`);
				break;

			case 'electron':
				versions.add(`Electron v${ELECTRON_TARGETS[support]}+`);
				break;

			case 'browser': {
				const targets =
					support === 'experimental' ? ['last 2 versions'] : toArray(BROWSER_TARGETS[support]);

				versions.add(`Browser (${targets[0]})`);

				break;
			}

			// no default
		}
	});

	return versions;
}

function getSupportVersions(platforms: Platform[], support: Support): string {
	return applyStyle([...getVersionsCombo(platforms, support)].sort().join(', '), 'muted');
}

export function PackageForm({ onSubmit }: PackageFormProps) {
	const [platform, setPlatform] = useState<Platform[]>([]);
	const [support, setSupport] = useState<Support>(DEFAULT_SUPPORT);
	const [format, setFormat] = useState<Format>('lib');
	const [input, setInput] = useState<string>('');
	const [namespace, setNamespace] = useState('');

	// Submit once all values are acceptable
	useEffect(() => {
		const hasUMD = format.includes('umd');

		if (
			platform.length > 0 &&
			format &&
			support &&
			input &&
			((hasUMD && namespace) || (!hasUMD && !namespace))
		) {
			const result = {
				format,
				inputs: { index: input },
				namespace,
				platform,
				support,
			};

			// Delay submission or focus API crashes
			// https://github.com/vadimdemedes/ink/pull/404
			setTimeout(() => {
				onSubmit(result);
			}, 100);

			// Reset state for the next package
			setPlatform([]);
			setSupport(DEFAULT_SUPPORT);
			setFormat('lib');
			setInput('');
			setNamespace('');
		}
	}, [format, input, namespace, onSubmit, platform, support]);

	// PLATFORM

	const platformOptions = useMemo<SelectOptionLike<Platform>[]>(
		() => [
			{ label: 'Browsers', value: 'browser' },
			{ label: 'Electron', value: 'electron' },
			{ label: 'Node', value: 'node' },
			{ label: 'React Native', value: 'native' },
		],
		[],
	);

	const validatePlatform = useCallback((value: Platform[]) => {
		if (value.length === 0) {
			throw new Error('Please select at least 1 platform');
		}
	}, []);

	// SUPPORT

	const supportOptions = useMemo<SelectOptionLike<Support>[]>(
		() => [
			{
				label: `Legacy ${getSupportVersions(platform, 'legacy')}`,
				value: 'legacy',
			},
			{
				label: `Stable ${getSupportVersions(platform, 'stable')}`,
				value: 'stable',
			},
			{
				label: `Current ${getSupportVersions(platform, 'current')}`,
				value: 'current',
			},
			{
				label: `Experimental ${getSupportVersions(platform, 'experimental')}`,
				value: 'experimental',
			},
		],
		[platform],
	);

	const validateSupport = useCallback((value: Support) => {
		if (!value) {
			throw new Error('Please select a supported environment');
		}
	}, []);

	// FORMAT

	const formatOptions = useMemo(() => {
		const options: SelectOptionLike<Format>[] = [{ label: 'Shared CommonJS', value: 'lib' }];

		if (platform.includes('node')) {
			options.push(
				{ label: `Node - CommonJS ${applyStyle('(.cjs)', 'muted')}`, value: 'cjs' },
				{ label: `Node - ECMAScript ${applyStyle('(.mjs)', 'muted')}`, value: 'mjs' },
			);
		}

		if (platform.includes('electron')) {
			options.push({ label: 'Electron - ECMAScript', value: 'esm' });
		}

		if (platform.includes('browser')) {
			options.push(
				{ label: 'Browser - ECMAScript', value: 'esm' },
				{ label: 'Browser - UMD', value: 'umd' },
			);
		}

		return options;
	}, [platform]);

	const validateFormat = useCallback((value: Format) => {
		if (!value) {
			throw new Error('Please select a format');
		}
	}, []);

	// INPUT

	const validateInput = useCallback((value: string) => {
		if (!value?.match(/[-_a-z\d./\\]+/iu)) {
			throw new Error('Must be a valid file path');
		}
	}, []);

	// NAMESPACE

	const validateNamespace = useCallback((value: string) => {
		if (!value?.match(/[a-z]\w+/iu)) {
			throw new Error('Must be in pascal-case or camel-case and start with an alpha character');
		}
	}, []);

	return (
		<>
			<MultiSelect<Platform>
				label="Platforms to target?"
				options={platformOptions}
				validate={validatePlatform}
				onSubmit={setPlatform}
			/>

			<Select<Support>
				defaultSelected={DEFAULT_SUPPORT}
				label="Environment to support?"
				options={supportOptions}
				validate={validateSupport}
				onSubmit={setSupport}
			/>

			<Select<Format>
				defaultSelected={DEFAULT_FORMATS[platform[0]]}
				label="Format to build?"
				options={formatOptions}
				validate={validateFormat}
				onSubmit={setFormat}
			/>

			<Input
				defaultValue={DEFAULT_INPUT}
				label="Main entry point?"
				validate={validateInput}
				onSubmit={setInput}
			/>

			{format.includes('umd') && (
				<Input label="UMD namespace?" validate={validateNamespace} onSubmit={setNamespace} />
			)}
		</>
	);
}
