/* eslint-disable no-param-reassign */

import { getSwcInputConfig, getSwcOutputConfig } from '../../src/swc/config';
import { Format, Platform, Support } from '../../src/types';

const SUPPORTS: Support[] = ['legacy', 'stable', 'current', 'experimental'];

describe('getSwcInputConfig()', () => {
	const bundleArtifact: any = {
		package: { hasDependency: () => false },
	};

	it('includes no parser/transformer options by default', () => {
		expect(getSwcInputConfig(bundleArtifact, {})).toMatchSnapshot();
	});

	it('includes react transformer if `react` feature flag is true', () => {
		expect(
			getSwcInputConfig(bundleArtifact, { react: 'automatic' }).jsc?.transform,
		).toMatchSnapshot();
	});

	it('includes typescript parser if `typescript` feature flag is true', () => {
		expect(getSwcInputConfig(bundleArtifact, { typescript: true }).jsc?.parser).toMatchSnapshot();
	});

	it('includes typescript decorators if `typescript` and `decorators` feature flag is true', () => {
		expect(
			getSwcInputConfig(bundleArtifact, { decorators: true, typescript: true }),
		).toMatchSnapshot();
	});

	it('doesnt include typescript decorators if `typescript` feature flag is false', () => {
		expect(
			getSwcInputConfig(bundleArtifact, { decorators: true, typescript: false }),
		).toMatchSnapshot();
	});

	it('supports private properties with decorators if dep exists', () => {
		const spy = jest.spyOn(bundleArtifact.package, 'hasDependency').mockImplementation(() => true);

		expect(
			getSwcInputConfig(bundleArtifact, { decorators: true, typescript: true }),
		).toMatchSnapshot();

		spy.mockRestore();
	});

	it('can mutate config', () => {
		expect(
			getSwcInputConfig(
				bundleArtifact,
				{},
				{
					swcInput(config) {
						config.rootMode = 'upward';
						config.cwd = 'INPUT';
					},
					swcOutput(config) {
						config.cwd = 'OUTPUT';
					},
				},
			),
		).toMatchSnapshot();
	});
});

function renderPresetEnv(platform: Platform, format: Format, support: Support) {
	// eslint-disable-next-line jest/require-top-level-describe
	test(`handles preset-env: ${platform} + ${format} + ${support}`, () => {
		expect(getSwcOutputConfig(platform, support, format, {})?.env).toMatchSnapshot();
	});
}

describe('getSwcOutputConfig()', () => {
	SUPPORTS.forEach((support) => {
		renderPresetEnv('native', 'lib', support);

		(['lib', 'cjs', 'mjs'] as const).forEach((format) => {
			renderPresetEnv('node', format, support);
		});

		(['lib', 'esm', 'umd'] as const).forEach((format) => {
			renderPresetEnv('browser', format, support);
		});
	});

	it('errors for invalid platform', () => {
		expect(() =>
			// @ts-expect-error Unknown platform
			getSwcOutputConfig('unknown', 'stable', 'lib', {}),
		).toThrow('Unknown platform "unknown".');
	});

	it('transforms async/await to promises when `browser` or `native`', () => {
		expect(getSwcOutputConfig('browser', 'stable', 'lib', {})).toMatchSnapshot();

		expect(getSwcOutputConfig('native', 'experimental', 'lib', {})).toMatchSnapshot();
	});

	it('uses built-in destructuring and object spread when `current` or `experimental`', () => {
		expect(getSwcOutputConfig('node', 'current', 'lib', {})).toMatchSnapshot();

		expect(getSwcOutputConfig('node', 'experimental', 'lib', {})).toMatchSnapshot();
	});

	it('can mutate config', () => {
		expect(
			getSwcOutputConfig(
				'browser',
				'stable',
				'lib',
				{},
				{
					swcInput(config) {
						config.cwd = 'INPUT';
					},
					swcOutput(config) {
						config.rootMode = 'upward';
						config.cwd = 'OUTPUT';
					},
				},
			),
		).toMatchSnapshot();
	});

	it('passes build params to config', () => {
		const spy = jest.fn();

		getSwcOutputConfig(
			'browser',
			'stable',
			'lib',
			{},
			{
				swcOutput: spy,
			},
		);

		expect(spy).toHaveBeenCalledWith(expect.any(Object), {
			features: {},
			format: 'lib',
			platform: 'browser',
			support: 'stable',
		});
	});
});
