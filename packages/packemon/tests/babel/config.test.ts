/* eslint-disable no-param-reassign */

// import { createConfig, createRootConfig } from '../../src/babel';
import { getBabelInputConfig, getBabelOutputConfig } from '../../src/babel/config';
import { Format, Platform, Support } from '../../src/types';

jest.mock('../../src/babel/resolve', () => ({
	resolve: (name: string) => name,
	resolveFromBabel: (name: string) => name,
}));

const SUPPORTS: Support[] = ['legacy', 'stable', 'current', 'experimental'];

describe('getBabelInputConfig()', () => {
	const bundleArtifact: any = {
		features: {},
		package: { hasDependency: () => false },
	};

	it('includes no plugins or presets by default', () => {
		expect(getBabelInputConfig(bundleArtifact, {})).toMatchSnapshot();
	});

	it('includes react preset if `react` feature flag is true', () => {
		expect(getBabelInputConfig(bundleArtifact, { react: 'classic' }).presets).toMatchSnapshot();
		expect(getBabelInputConfig(bundleArtifact, { react: 'automatic' }).presets).toMatchSnapshot();
	});

	it('includes solid preset if `solid` feature flag is true', () => {
		expect(getBabelInputConfig(bundleArtifact, { solid: true }).presets).toMatchSnapshot();
	});

	it('includes flow preset if `flow` feature flag is true', () => {
		expect(getBabelInputConfig(bundleArtifact, { flow: true }).presets).toMatchSnapshot();
	});

	it('includes typescript preset if `typescript` feature flag is true', () => {
		expect(getBabelInputConfig(bundleArtifact, { typescript: true }).presets).toMatchSnapshot();
	});

	it('includes typescript decorators if `typescript` and `decorators` feature flag is true', () => {
		expect(
			getBabelInputConfig(bundleArtifact, { decorators: true, typescript: true }),
		).toMatchSnapshot();
	});

	it('doesnt include typescript decorators if `typescript` feature flag is false', () => {
		expect(
			getBabelInputConfig(bundleArtifact, { decorators: true, typescript: false }),
		).toMatchSnapshot();
	});

	it('supports private properties with decorators if dep exists', () => {
		const spy = jest.spyOn(bundleArtifact.package, 'hasDependency').mockImplementation(() => true);

		expect(
			getBabelInputConfig(bundleArtifact, { decorators: true, typescript: true }),
		).toMatchSnapshot();

		spy.mockRestore();
	});

	it('can mutate config', () => {
		expect(
			getBabelInputConfig(
				bundleArtifact,
				{},
				{
					babelInput(config) {
						config.rootMode = 'upward';
						config.plugins?.push('babel-plugin-example');
					},
					babelOutput(config) {
						config.plugins?.push('babel-plugin-shouldnt-show-up');
					},
				},
			),
		).toMatchSnapshot();
	});
});

function renderPresetEnv(platform: Platform, format: Format, support: Support) {
	// eslint-disable-next-line jest/require-top-level-describe
	test(`handles preset-env: ${platform} + ${format} + ${support}`, () => {
		expect(getBabelOutputConfig(platform, support, format, {})?.presets?.[0]).toMatchSnapshot();
	});
}

describe('getBabelOutputConfig()', () => {
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
			getBabelOutputConfig('unknown', 'stable', 'lib', {}),
		).toThrow('Unknown platform "unknown".');
	});

	it('transforms async/await to promises when `browser` or `native`', () => {
		expect(getBabelOutputConfig('browser', 'stable', 'lib', {})).toMatchSnapshot();

		expect(getBabelOutputConfig('native', 'experimental', 'lib', {})).toMatchSnapshot();
	});

	it('uses built-in destructuring and object spread when `current` or `experimental`', () => {
		expect(getBabelOutputConfig('node', 'current', 'lib', {})).toMatchSnapshot();

		expect(getBabelOutputConfig('node', 'experimental', 'lib', {})).toMatchSnapshot();
	});

	it('sets `parserOpts.strictMode` based on `strict` feature flag', () => {
		expect(getBabelOutputConfig('node', 'stable', 'lib', { strict: true })).toEqual(
			expect.objectContaining({
				parserOpts: {
					sourceType: 'unambiguous',
					strictMode: true,
				},
			}),
		);
	});

	it('can mutate config', () => {
		expect(
			getBabelOutputConfig(
				'browser',
				'stable',
				'lib',
				{},
				{
					babelInput(config) {
						config.plugins?.push('babel-plugin-shouldnt-show-up');
					},
					babelOutput(config) {
						config.rootMode = 'upward';
						config.plugins?.push('babel-plugin-example');
					},
				},
			),
		).toMatchSnapshot();
	});

	it('passes build params to config', () => {
		const spy = jest.fn();

		getBabelOutputConfig(
			'browser',
			'stable',
			'lib',
			{},
			{
				babelOutput: spy,
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

// describe('createRootConfig()', () => {
// 	it('returns the correct config', () => {
// 		expect(createRootConfig()).toMatchSnapshot();
// 	});
// });

// describe('createConfig()', () => {
// 	it('returns the correct config', () => {
// 		expect(createConfig(process.cwd())).toMatchSnapshot();
// 	});
// });
