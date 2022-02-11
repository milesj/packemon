import { Config } from '../../src';
import { createConfig, createRootConfig } from '../../src/babel';
import { getBabelInputConfig, getBabelOutputConfig } from '../../src/babel/config';
import { Format, Platform, Support } from '../../src/types';

jest.mock('../../src/babel/resolve', () => ({
	resolve: (name: string) => name,
	resolveFromBabel: (name: string) => name,
}));

const SUPPORTS: Support[] = ['legacy', 'stable', 'current', 'experimental'];

describe('getBabelInputConfig()', () => {
	const bundleArtifact: any = {
		package: { hasDependency: () => false },
	};

	let config: Config;

	beforeEach(() => {
		config = new Config();
	});

	it('includes no plugins or presets by default', () => {
		expect(getBabelInputConfig(bundleArtifact, {}, config)).toMatchSnapshot();
	});

	it('includes react preset if `react` feature flag is true', () => {
		expect(getBabelInputConfig(bundleArtifact, { react: true }, config).presets).toMatchSnapshot();
	});

	it('includes flow preset if `flow` feature flag is true', () => {
		expect(getBabelInputConfig(bundleArtifact, { flow: true }, config).presets).toMatchSnapshot();
	});

	it('includes typescript preset if `typescript` feature flag is true', () => {
		expect(
			getBabelInputConfig(bundleArtifact, { typescript: true }, config).presets,
		).toMatchSnapshot();
	});

	it('includes typescript decorators if `typescript` and `decorators` feature flag is true', () => {
		expect(
			getBabelInputConfig(bundleArtifact, { decorators: true, typescript: true }, config),
		).toMatchSnapshot();
	});

	it('doesnt include typescript decorators if `typescript` feature flag is false', () => {
		expect(
			getBabelInputConfig(bundleArtifact, { decorators: true, typescript: false }, config),
		).toMatchSnapshot();
	});

	it('supports private properties with decorators if dep exists', () => {
		const spy = jest.spyOn(bundleArtifact.package, 'hasDependency').mockImplementation(() => true);

		expect(
			getBabelInputConfig(bundleArtifact, { decorators: true, typescript: true }, config),
		).toMatchSnapshot();

		spy.mockRestore();
	});
});

function renderPresetEnv(platform: Platform, format: Format, support: Support) {
	// eslint-disable-next-line jest/require-top-level-describe
	test(`handles preset-env: ${platform} + ${format} + ${support}`, () => {
		expect(
			getBabelOutputConfig(platform, support, format, {}, new Config())?.presets?.[0],
		).toMatchSnapshot();
	});
}

describe('getBabelOutputConfig()', () => {
	let config: Config;

	beforeEach(() => {
		config = new Config();
	});

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
		expect(getBabelOutputConfig('browser', 'stable', 'lib', {}, config)).toMatchSnapshot();

		expect(getBabelOutputConfig('native', 'experimental', 'lib', {}, config)).toMatchSnapshot();
	});

	it('uses built-in destructuring and object spread when `current` or `experimental`', () => {
		expect(getBabelOutputConfig('node', 'current', 'lib', {}, config)).toMatchSnapshot();

		expect(getBabelOutputConfig('node', 'experimental', 'lib', {}, config)).toMatchSnapshot();
	});

	it('sets `parserOpts.strictMode` based on `strict` feature flag', () => {
		expect(getBabelOutputConfig('node', 'stable', 'lib', { strict: true }, config)).toEqual(
			expect.objectContaining({
				parserOpts: {
					sourceType: 'unambiguous',
					strictMode: true,
				},
			}),
		);
	});

	it('sets `babelrcRoots` based on `workspaces` feature flag', () => {
		expect(
			getBabelOutputConfig('node', 'stable', 'lib', { workspaces: ['packages/*'] }, config),
		).toEqual(
			expect.objectContaining({
				babelrcRoots: ['packages/*'],
			}),
		);
	});
});

describe('createRootConfig()', () => {
	it('returns the correct config', () => {
		expect(createRootConfig()).toMatchSnapshot();
	});
});

describe('createConfig()', () => {
	it('returns the correct config', () => {
		expect(createConfig(process.cwd())).toMatchSnapshot();
	});
});
