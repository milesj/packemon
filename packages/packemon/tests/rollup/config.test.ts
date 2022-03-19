/* eslint-disable no-param-reassign */
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { CodeArtifact } from '../../src/CodeArtifact';
import { Package } from '../../src/Package';
import { Project } from '../../src/Project';
import {
	getRollupConfig,
	getRollupExternals,
	getRollupOutputConfig,
} from '../../src/rollup/config';

jest.mock('@rollup/plugin-commonjs', () => () => 'commonjs()');
jest.mock('@rollup/plugin-json', () => () => 'json()');
jest.mock('@rollup/plugin-node-resolve', () => () => 'resolve()');
jest.mock('@rollup/plugin-babel', () => ({
	getBabelInputPlugin: (options: any) => `babelInput(${options.filename})`,
	getBabelOutputPlugin: (options: any) =>
		`babelOutput(${options.filename}, ${options.moduleId || '*'})`,
}));
jest.mock(
	'rollup-plugin-node-externals',
	() => (options: any) => `externals(${options.packagePath})`,
);
jest.mock('rollup-plugin-polyfill-node', () => () => `polyfillNode()`);
jest.mock('rollup-plugin-visualizer', () => (options: any) => `visualizer(${typeof options})`);

const fixturePath = new Path(getFixturePath('project-rollup'));
const srcInputFile = fixturePath.append('src/index.ts').path();

function createArtifact(outputName: string, inputFile: string, pkg?: Package) {
	const artifact = new CodeArtifact(
		pkg ??
			new Package(new Project(fixturePath), fixturePath, {
				name: 'project',
				version: '0.0.0',
				packemon: {},
			}),
		[],
	);
	artifact.configGroup = 1;
	artifact.inputs = {
		[outputName]: inputFile,
	};
	artifact.startup();

	return artifact;
}

const binPlugin = expect.objectContaining({ name: 'packemon-add-bin-shebang' });

describe('getRollupConfig()', () => {
	const sharedPlugins = [
		`externals(${fixturePath.append('package.json')})`,
		'resolve()',
		'commonjs()',
		'json()',
		expect.any(Object),
		`babelInput(${fixturePath})`,
	];

	const sharedNonNodePlugins = ['polyfillNode()', ...sharedPlugins];

	let artifact: CodeArtifact;

	beforeEach(() => {
		artifact = createArtifact('index', 'src/index.ts');
	});

	it('generates default input config for `browser` platform', () => {
		artifact.platform = 'browser';

		expect(getRollupConfig(artifact, {})).toEqual({
			cache: undefined,
			external: expect.any(Function),
			input: { index: srcInputFile },
			output: [],
			plugins: sharedNonNodePlugins,
			treeshake: true,
		});
	});

	it('generates default input config for `native` platform', () => {
		artifact.platform = 'native';

		expect(getRollupConfig(artifact, {})).toEqual({
			cache: undefined,
			external: expect.any(Function),
			input: { index: srcInputFile },
			output: [],
			plugins: sharedNonNodePlugins,
			treeshake: true,
		});
	});

	it('generates default input config for `node` platform', () => {
		artifact.platform = 'node';

		expect(getRollupConfig(artifact, {})).toEqual({
			cache: undefined,
			external: expect.any(Function),
			input: { index: srcInputFile },
			output: [],
			plugins: sharedPlugins,
			treeshake: true,
		});
	});

	it('generates an output config for each build', () => {
		artifact.builds.push({ format: 'lib' }, { format: 'esm' }, { format: 'mjs' });

		expect(getRollupConfig(artifact, {})).toEqual({
			cache: undefined,
			external: expect.any(Function),
			input: {
				index: srcInputFile,
			},
			output: [
				{
					assetFileNames: 'assets/[name].[ext]',
					banner: expect.any(String),
					chunkFileNames: 'bundle-[hash].js',
					dir: fixturePath.append('lib').path(),
					entryFileNames: '[name].js',
					exports: 'auto',
					format: 'cjs',
					generatedCode: {
						preset: 'es2015',
						symbols: false,
					},
					interop: 'auto',
					originalFormat: 'lib',
					paths: {},
					plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
					preferConst: true,
					preserveModules: false,
					sourcemap: true,
					sourcemapExcludeSources: true,
				},
				{
					assetFileNames: 'assets/[name].[ext]',
					banner: expect.any(String),
					chunkFileNames: 'bundle-[hash].js',
					dir: fixturePath.append('esm').path(),
					entryFileNames: '[name].js',
					format: 'esm',
					generatedCode: {
						preset: 'es2015',
						symbols: false,
					},
					interop: 'auto',
					originalFormat: 'esm',
					paths: {},
					plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
					preferConst: true,
					preserveModules: false,
					sourcemap: true,
					sourcemapExcludeSources: true,
				},
				{
					assetFileNames: 'assets/[name].[ext]',
					banner: expect.any(String),
					chunkFileNames: 'bundle-[hash].mjs',
					dir: fixturePath.append('mjs').path(),
					entryFileNames: '[name].mjs',
					format: 'esm',
					generatedCode: {
						preset: 'es2015',
						symbols: false,
					},
					interop: 'auto',
					originalFormat: 'mjs',
					paths: {},
					plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
					preferConst: true,
					preserveModules: false,
					sourcemap: true,
					sourcemapExcludeSources: true,
				},
			],
			plugins: sharedPlugins,
			treeshake: true,
		});
	});

	it('generates an accurate config if input/output are not "index"', () => {
		artifact.inputs = {
			server: 'src/server/core.ts',
		};
		artifact.builds.push({ format: 'lib' });

		expect(getRollupConfig(artifact, {})).toEqual({
			cache: undefined,
			external: expect.any(Function),
			input: {
				server: fixturePath.append('src/server/core.ts').path(),
			},
			output: [
				{
					assetFileNames: 'assets/[name].[ext]',
					banner: expect.any(String),
					chunkFileNames: 'bundle-[hash].js',
					dir: fixturePath.append('lib').path(),
					entryFileNames: '[name].js',
					exports: 'auto',
					format: 'cjs',
					generatedCode: {
						preset: 'es2015',
						symbols: false,
					},
					interop: 'auto',
					originalFormat: 'lib',
					paths: {},
					plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
					preferConst: true,
					preserveModules: false,
					sourcemap: true,
					sourcemapExcludeSources: true,
				},
			],
			plugins: sharedPlugins,
			treeshake: true,
		});
	});

	it('when not bundling, globs all source files, preserves modules, and doesnt treeshake', () => {
		artifact.bundle = false;
		artifact.builds.push({ format: 'lib' });

		expect(getRollupConfig(artifact, {})).toEqual({
			cache: undefined,
			external: expect.any(Function),
			input: [
				'src/index.ts',
				'src/client/index.ts',
				'src/other/index.ts',
				'src/server/core.ts',
				'src/test-utils/base.ts',
			].map((f) => fixturePath.append(f).path()),
			output: [
				{
					assetFileNames: 'assets/[name].[ext]',
					chunkFileNames: '[name]-[hash].js',
					dir: fixturePath.append('lib').path(),
					entryFileNames: '[name].js',
					exports: 'auto',
					format: 'cjs',
					generatedCode: {
						preset: 'es2015',
						symbols: false,
					},
					interop: 'auto',
					originalFormat: 'lib',
					paths: {},
					plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
					preferConst: true,
					preserveModules: true,
					sourcemap: true,
					sourcemapExcludeSources: true,
				},
			],
			plugins: sharedPlugins,
			treeshake: false,
		});
	});

	it('inherits artifact rollup cache', () => {
		artifact.cache = { modules: [] };

		expect(getRollupConfig(artifact, {}).cache).toEqual({
			modules: [],
		});
	});

	it('includes analyzer plugin if `analyze` feature flag is on', () => {
		artifact.builds.push({ format: 'lib' });
		expect(getRollupConfig(artifact, { analyze: 'treemap' }).plugins).toEqual([
			...sharedPlugins,
			'visualizer(function)',
		]);
	});

	it('can mutate config', () => {
		artifact.platform = 'browser';

		expect(
			getRollupConfig(
				artifact,
				{},
				{
					rollupInput(config) {
						config.treeshake = false;
						config.output = {
							inlineDynamicImports: true,
						};
					},
					rollupOutput(output) {
						output.strict = false; // Shouldnt show up
					},
				},
			),
		).toEqual({
			cache: undefined,
			external: expect.any(Function),
			input: { index: srcInputFile },
			output: {
				inlineDynamicImports: true,
			},
			plugins: sharedNonNodePlugins,
			treeshake: false,
		});
	});

	describe('externals', () => {
		beforeEach(() => {
			// Add self
			artifact.package.addArtifact(artifact);
		});

		it('returns false for self', () => {
			expect(getRollupExternals(artifact)(srcInputFile)).toBe(false);
		});

		it('returns false for random files', () => {
			expect(getRollupExternals(artifact)('some/random/file.js')).toBe(false);
		});

		describe('foreign inputs (not in the same artifact config)', () => {
			it('errors for different paths', () => {
				const foreignArtifact = createArtifact('other', 'src/other/index.ts', artifact.package);
				foreignArtifact.configGroup = 10;

				artifact.package.addArtifact(foreignArtifact);

				const parent = srcInputFile;
				const child = fixturePath.append('src/other/index.ts').path();

				try {
					getRollupExternals(artifact)(child, parent);
				} catch (error: unknown) {
					expect((error as Error).message).toContain('Unexpected foreign input import.');
				}

				expect(() => getRollupExternals(artifact)(child, srcInputFile)).toThrow(
					`Unexpected foreign input import. May only import sibling files within the same \`inputs\` configuration group. File "${parent}" attempted to import "${child}".`,
				);
			});

			it('doesnt error if paths are the same in both configs', () => {
				const foreignArtifact = createArtifact('other', 'src/index.ts', artifact.package);
				foreignArtifact.configGroup = 10;

				artifact.package.addArtifact(foreignArtifact);

				const parent = srcInputFile;
				const child = fixturePath.append('src/index.ts').path();

				expect(() => getRollupExternals(artifact)(child, parent)).not.toThrow();
			});
		});
	});
});

describe('getRollupOutputConfig()', () => {
	let artifact: CodeArtifact;

	beforeEach(() => {
		artifact = createArtifact('index', 'src/index.ts');
		artifact.platform = 'node';
		artifact.support = 'stable';
	});

	it('generates default output config', () => {
		expect(getRollupOutputConfig(artifact, {}, 'lib')).toEqual({
			assetFileNames: 'assets/[name].[ext]',
			banner: expect.any(String),
			chunkFileNames: 'bundle-[hash].js',
			dir: fixturePath.append('lib').path(),
			entryFileNames: '[name].js',
			exports: 'auto',
			format: 'cjs',
			generatedCode: {
				preset: 'es2015',
				symbols: false,
			},
			interop: 'auto',
			originalFormat: 'lib',
			paths: {},
			plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
			preferConst: true,
			preserveModules: false,
			sourcemap: true,
			sourcemapExcludeSources: true,
		});
	});

	it('changes output dir based on format', () => {
		artifact.platform = 'browser';
		artifact.support = 'stable';

		expect(getRollupOutputConfig(artifact, {}, 'esm').dir).toBe(fixturePath.append('esm').path());

		artifact.platform = 'node';
		artifact.support = 'stable';

		expect(getRollupOutputConfig(artifact, {}, 'mjs').dir).toBe(fixturePath.append('mjs').path());
	});

	it('can mutate config', () => {
		artifact.platform = 'browser';

		expect(
			getRollupOutputConfig(artifact, {}, 'lib', {
				rollupInput(config) {
					config.treeshake = false; // Shouldnt show up
				},
				rollupOutput(output) {
					output.sourcemap = false;
					output.generatedCode = 'es5';
				},
			}),
		).toEqual({
			assetFileNames: 'assets/[name].[ext]',
			banner: expect.any(String),
			chunkFileNames: 'bundle-[hash].js',
			dir: fixturePath.append('lib').path(),
			entryFileNames: '[name].js',
			exports: 'auto',
			format: 'cjs',
			generatedCode: 'es5',
			interop: 'auto',
			originalFormat: 'lib',
			paths: {},
			plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
			preferConst: true,
			preserveModules: false,
			sourcemap: false,
			sourcemapExcludeSources: true,
		});
	});

	it('passes build params to config', () => {
		const spy = jest.fn();

		getRollupOutputConfig(artifact, {}, 'lib', {
			rollupOutput: spy,
		});

		expect(spy).toHaveBeenCalledWith(expect.any(Object), {
			features: {},
			format: 'lib',
			platform: 'node',
			support: 'stable',
		});
	});

	describe('formats', () => {
		it('converts `lib` format to rollup "cjs" format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'lib')).toEqual(
				expect.objectContaining({
					format: 'cjs',
					originalFormat: 'lib',
				}),
			);
		});

		it('converts `cjs` format to rollup "cjs" format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'cjs')).toEqual(
				expect.objectContaining({
					format: 'cjs',
					originalFormat: 'cjs',
				}),
			);
		});

		it('converts `mjs` format to rollup "esm" format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'mjs')).toEqual(
				expect.objectContaining({
					format: 'esm',
					originalFormat: 'mjs',
				}),
			);
		});

		it('converts `esm` format to rollup "esm" format', () => {
			artifact.platform = 'browser';

			expect(getRollupOutputConfig(artifact, {}, 'esm')).toEqual(
				expect.objectContaining({
					format: 'esm',
					originalFormat: 'esm',
				}),
			);
		});

		it('converts `umd` format to rollup "esm" format', () => {
			artifact.platform = 'browser';

			expect(getRollupOutputConfig(artifact, {}, 'umd')).toEqual(
				expect.objectContaining({
					format: 'esm',
					originalFormat: 'umd',
				}),
			);
		});
	});

	describe('chunks', () => {
		it('uses ".js" chunk extension for `lib` format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'lib')).toEqual(
				expect.objectContaining({
					chunkFileNames: 'bundle-[hash].js',
					entryFileNames: '[name].js',
				}),
			);
		});

		it('uses ".js" chunk extension for `esm` format', () => {
			artifact.platform = 'browser';

			expect(getRollupOutputConfig(artifact, {}, 'esm')).toEqual(
				expect.objectContaining({
					chunkFileNames: 'bundle-[hash].js',
					entryFileNames: '[name].js',
				}),
			);
		});

		it('uses ".js" chunk extension for `umd` format', () => {
			artifact.platform = 'browser';

			expect(getRollupOutputConfig(artifact, {}, 'umd')).toEqual(
				expect.objectContaining({
					chunkFileNames: 'bundle-[hash].js',
					entryFileNames: '[name].js',
				}),
			);
		});

		it('uses ".cjs" chunk extension for `cjs` format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'cjs')).toEqual(
				expect.objectContaining({
					chunkFileNames: 'bundle-[hash].cjs',
					entryFileNames: '[name].cjs',
				}),
			);
		});

		it('uses ".mjs" chunk extension for `mjs` format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'mjs')).toEqual(
				expect.objectContaining({
					chunkFileNames: 'bundle-[hash].mjs',
					entryFileNames: '[name].mjs',
				}),
			);
		});
	});

	describe('exports', () => {
		it('enables auto-exports for `lib` format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'lib').exports).toBe('auto');
		});

		it('enables auto-exports for `cjs` format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'cjs').exports).toBe('auto');
		});

		it('disables auto-exports for `mjs` format', () => {
			expect(getRollupOutputConfig(artifact, {}, 'mjs').exports).toBeUndefined();
		});

		it('disables auto-exports for `esm` format', () => {
			artifact.platform = 'browser';

			expect(getRollupOutputConfig(artifact, {}, 'esm').exports).toBeUndefined();
		});

		it('disables auto-exports for `umd` format', () => {
			artifact.platform = 'browser';

			expect(getRollupOutputConfig(artifact, {}, 'umd').exports).toBeUndefined();
		});
	});

	it('enables `const` for non-legacy versions', () => {
		artifact.support = 'legacy';

		expect(getRollupOutputConfig(artifact, {}, 'lib').preferConst).toBe(false);

		artifact.support = 'stable';

		expect(getRollupOutputConfig(artifact, {}, 'lib').preferConst).toBe(true);

		artifact.support = 'current';

		expect(getRollupOutputConfig(artifact, {}, 'lib').preferConst).toBe(true);

		artifact.support = 'experimental';

		expect(getRollupOutputConfig(artifact, {}, 'lib').preferConst).toBe(true);
	});

	it('passes `namespace` to Babel as UMD name', () => {
		artifact.platform = 'browser';
		artifact.support = 'experimental';
		artifact.namespace = 'FooBar';

		expect(getRollupOutputConfig(artifact, {}, 'umd')).toEqual({
			assetFileNames: 'assets/[name].[ext]',
			banner: expect.any(String),
			chunkFileNames: 'bundle-[hash].js',
			dir: fixturePath.append('umd').path(),
			entryFileNames: '[name].js',
			format: 'esm',
			generatedCode: {
				preset: 'es2015',
				symbols: false,
			},
			interop: 'auto',
			originalFormat: 'umd',
			paths: {},
			plugins: [`babelOutput(${fixturePath}, FooBar)`, binPlugin],
			preferConst: true,
			preserveModules: false,
			sourcemap: true,
			sourcemapExcludeSources: true,
		});
	});
});
