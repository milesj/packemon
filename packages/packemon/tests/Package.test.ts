/* eslint-disable jest/no-disabled-tests */
import fsx from 'fs-extra';
import { Path } from '@boost/common';
import { mockNormalizedFilePath } from '@boost/common/test';
import { getFixturePath } from '@boost/test-utils';
import { Artifact } from '../src/Artifact';
import { Package } from '../src/Package';
import { Build, ConfigFile, Platform, Support } from '../src/types';
import { loadPackageAtPath } from './helpers';

jest.mock('rollup', () => ({ rollup: jest.fn() }));

describe('Packemon', () => {
	const fixturePath = getFixturePath('project');
	let pkg: Package;

	function createArtifacts() {
		const a = new Artifact(pkg, []);
		const b = new Artifact(pkg, []);
		const c = new Artifact(pkg, []);

		return [a, b, c];
	}

	function createCodeArtifact(
		builds: Build[],
		platform: Platform = 'node',
		support: Support = 'stable',
	) {
		const artifact = new Artifact(pkg, builds);
		artifact.platform = platform;
		artifact.support = support;
		artifact.inputs = {
			index: 'src/index.ts',
		};

		artifact.build = () => Promise.resolve();

		return artifact;
	}

	beforeEach(() => {
		pkg = loadPackageAtPath(fixturePath);
	});

	it('sets properties on instantiation', () => {
		expect(pkg.path).toEqual(mockNormalizedFilePath(fixturePath));
		expect(pkg.jsonPath).toEqual(new Path(fixturePath, 'package.json'));
		expect(pkg.json).toEqual(
			expect.objectContaining({
				name: 'project',
			}),
		);
	});

	describe('build()', () => {
		let writeSpy: jest.SpyInstance;
		let config: ConfigFile;

		beforeEach(() => {
			writeSpy = jest.spyOn(fsx, 'writeJson').mockImplementation();
			config = {};
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it('calls `build` on each artifact', async () => {
			const [a, b, c] = createArtifacts();
			const aSpy = jest.spyOn(a, 'build').mockImplementation();
			const bSpy = jest.spyOn(b, 'build').mockImplementation();
			const cSpy = jest.spyOn(c, 'build').mockImplementation();

			pkg.artifacts.push(a, b, c);

			await pkg.build({ concurrency: 1 }, config);

			expect(aSpy).toHaveBeenCalledWith({ concurrency: 1 }, expect.any(Object));
			expect(bSpy).toHaveBeenCalledWith({ concurrency: 1 }, expect.any(Object));
			expect(cSpy).toHaveBeenCalledWith({ concurrency: 1 }, expect.any(Object));
		});

		it('sets passed state and result time', async () => {
			const artifact = new Artifact(pkg, []);

			pkg.artifacts.push(artifact);

			expect(artifact.state).toBe('pending');
			expect(artifact.buildResult.time).toBe(0);

			await pkg.build({}, config);

			expect(artifact.state).toBe('passed');
			expect(artifact.buildResult.time).not.toBe(0);
		});

		it('sets failed state and result time on error', async () => {
			const artifact = new Artifact(pkg, []);

			jest.spyOn(artifact, 'build').mockImplementation(() => {
				throw new Error('Whoops');
			});

			pkg.artifacts.push(artifact);

			expect(artifact.state).toBe('pending');

			try {
				await pkg.build({}, config);
			} catch (error: unknown) {
				expect(error).toEqual(new Error('Whoops'));
			}

			expect(artifact.state).toBe('failed');
		});

		it('syncs `package.json` when done building', async () => {
			const artifact = new Artifact(pkg, []);
			const spy = jest.spyOn(pkg, 'syncJson');

			pkg.artifacts.push(artifact);

			await pkg.build({}, config);

			expect(spy).toHaveBeenCalled();
		});

		describe('stamp', () => {
			it('does nothing if `stamp` is false', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }], 'browser'));

				await pkg.build({ stamp: false }, config);

				expect(pkg.json.release).toBeUndefined();
			});

			it('adds if `stamp` is true', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }], 'browser'));

				await pkg.build({ stamp: true }, config);

				expect(pkg.json.release).toBeDefined();
			});
		});

		describe('engines', () => {
			it('does nothing if `addEngines` is false', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }], 'browser'));

				await pkg.build({ addEngines: false }, config);

				expect(pkg.json.engines).toBeUndefined();
			});

			it('does nothing if builds is not `node`', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }], 'browser'));

				await pkg.build({ addEngines: true }, config);

				expect(pkg.json.engines).toBeUndefined();
			});

			it('adds node engines for `node` build', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }]));

				await pkg.build({ addEngines: true }, config);

				expect(pkg.json.engines).toEqual({ node: '>=14.15.0' });
			});

			it('uses oldest `node` build', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }]));

				const old = createCodeArtifact([{ format: 'lib' }]);
				old.support = 'legacy';
				pkg.artifacts.push(old);

				await pkg.build({ addEngines: true }, config);

				expect(pkg.json.engines).toEqual({ node: '>=12.22.0' });
			});

			it('merges with existing engines', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }]));

				pkg.json.engines = {
					packemon: '*',
				};

				expect(pkg.json.engines).toEqual({ packemon: '*' });

				await pkg.build({ addEngines: true }, config);

				expect(pkg.json.engines).toEqual({
					packemon: '*',
					node: '>=14.15.0',
				});
			});
		});

		describe('entries', () => {
			describe('main', () => {
				it('adds "main" for node `lib` format', async () => {
					pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }]));

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './lib/index.js',
						}),
					);
				});

				it('adds "main" for node `cjs` format', async () => {
					pkg.artifacts.push(createCodeArtifact([{ format: 'cjs' }]));

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './cjs/index.cjs',
						}),
					);
				});

				it('adds "main" for node `mjs` format', async () => {
					pkg.artifacts.push(createCodeArtifact([{ format: 'mjs' }]));

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './mjs/index.mjs',
						}),
					);
				});

				it('adds "main" for browser `lib` format', async () => {
					const a = createCodeArtifact([{ format: 'lib' }], 'browser');
					pkg.artifacts.push(a);

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './lib/index.js',
						}),
					);
				});

				it('adds "main" for browser `esm` format', async () => {
					pkg.artifacts.push(createCodeArtifact([{ format: 'esm' }], 'browser'));

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './esm/index.js',
						}),
					);
				});

				it('adds "main" for native `lib` format', async () => {
					const a = createCodeArtifact([{ format: 'lib' }], 'native');
					pkg.artifacts.push(a);

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './lib/index.js',
						}),
					);
				});

				it('adds "main" if output name is not "index"', async () => {
					const a = createCodeArtifact([{ format: 'lib' }]);
					a.inputs = { server: 'src/index.ts' };
					pkg.artifacts.push(a);

					await pkg.build({}, config);

					expect(pkg.json.main).toBe('./lib/server.js');
				});

				it('adds "main" when using shared `lib` format', async () => {
					const a = createCodeArtifact([{ format: 'lib' }]);
					a.sharedLib = true;
					pkg.artifacts.push(a);

					const b = createCodeArtifact([{ format: 'lib' }], 'browser');
					b.sharedLib = true;
					pkg.artifacts.push(b);

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './lib/node/index.js',
						}),
					);
				});

				it('node "main" always takes precedence when multiple `lib` formats', async () => {
					const b = createCodeArtifact([{ format: 'lib' }], 'browser');
					b.sharedLib = true;
					pkg.artifacts.push(b);

					const a = createCodeArtifact([{ format: 'lib' }]);
					a.sharedLib = true;
					pkg.artifacts.push(a);

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './lib/node/index.js',
						}),
					);
				});
			});

			describe('module', () => {
				it('adds "module" for browser `esm` format', async () => {
					const a = createCodeArtifact([{ format: 'esm' }], 'browser');
					pkg.artifacts.push(a);

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							module: './esm/index.js',
						}),
					);
				});
			});

			describe('browser', () => {
				beforeEach(() => {
					const node = createCodeArtifact([{ format: 'lib' }]);
					node.sharedLib = true;

					const browser = createCodeArtifact([{ format: 'lib' }], 'browser');
					browser.sharedLib = true;

					pkg.artifacts.push(node, browser);
				});

				it('adds "browser" when browser and node are sharing a lib', async () => {
					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './lib/node/index.js',
							browser: './lib/browser/index.js',
						}),
					);
				});

				it('adds "browser" for umd builds', async () => {
					pkg.artifacts[1] = createCodeArtifact([{ format: 'umd' }], 'browser');

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './lib/node/index.js',
							browser: './umd/index.js',
						}),
					);
				});

				it('doesnt override "browser" field if its an object', async () => {
					// @ts-expect-error Types are wrong
					pkg.json.browser = { module: 'foo' };

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							main: './lib/node/index.js',
							browser: { module: 'foo' },
						}),
					);
				});
			});

			describe('types', () => {
				it('adds "types" when a types artifact exists', async () => {
					pkg.artifacts.push(createCodeArtifact([{ declaration: true, format: 'lib' }]));

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							types: './lib/index.d.ts',
						}),
					);
				});
			});

			describe('bin', () => {
				it('adds "bin" for node `lib` format', async () => {
					const a = createCodeArtifact([{ format: 'lib' }]);
					a.inputs = { bin: 'src/bin.ts' };
					pkg.artifacts.push(a);

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							bin: './lib/bin.js',
						}),
					);
				});

				it('adds "bin" for node `cjs` format', async () => {
					const a = createCodeArtifact([{ format: 'cjs' }]);
					a.inputs = { bin: 'src/bin.ts' };
					pkg.artifacts.push(a);

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							bin: './cjs/bin.cjs',
						}),
					);
				});

				it('adds "bin" for node `mjs` format', async () => {
					const a = createCodeArtifact([{ format: 'mjs' }]);
					a.inputs = { bin: 'src/bin.ts' };
					pkg.artifacts.push(a);

					await pkg.build({}, config);

					expect(pkg.json).toEqual(
						expect.objectContaining({
							bin: './mjs/bin.mjs',
						}),
					);
				});

				it('doesnt add "bin" if value is an object', async () => {
					const a = createCodeArtifact([{ format: 'lib' }]);
					a.inputs = { bin: 'src/bin.ts' };
					pkg.artifacts.push(a);

					pkg.json.bin = {};

					await pkg.build({}, config);

					expect(pkg.json.bin).toEqual({});
				});
			});
		});

		describe.skip('exports', () => {
			it('does nothing if no builds', async () => {
				pkg.artifacts.push(new Artifact(pkg, []));

				await pkg.build({}, config);

				expect(pkg.json.exports).toBeUndefined();
			});

			it('does nothing if `addExports` is false', async () => {
				pkg.artifacts.push(new Artifact(pkg, []));

				await pkg.build({ addExports: false }, config);

				expect(pkg.json.exports).toBeUndefined();
			});

			it('adds exports for a single artifact and format', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }]));

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': { node: './lib/index.js', default: './lib/index.js' },
					'./package.json': './package.json',
				});
			});

			it('adds exports for a single artifact and multiple format', async () => {
				pkg.artifacts.push(
					createCodeArtifact([{ format: 'lib' }, { format: 'mjs' }, { format: 'cjs' }]),
				);

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': {
						node: {
							import: './mjs/index.mjs',
							require: './cjs/index.cjs',
						},
						default: './lib/index.js',
					},
					'./package.json': './package.json',
				});
			});

			it('adds exports for multiple artifacts of the same output name', async () => {
				const a = createCodeArtifact([{ format: 'lib' }]);
				a.sharedLib = true;
				pkg.artifacts.push(a);

				const b = createCodeArtifact([{ format: 'lib' }], 'browser');
				b.sharedLib = true;
				pkg.artifacts.push(b);

				const c = createCodeArtifact([{ format: 'lib' }], 'native');
				c.sharedLib = true;
				pkg.artifacts.push(c);

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': {
						node: './lib/node/index.js',
						browser: './lib/browser/index.js',
						'react-native': './lib/native/index.js',
						default: './lib/native/index.js',
					},
					'./package.json': './package.json',
				});
			});

			it('adds exports for multiple artifacts + formats of the same output name', async () => {
				const a = createCodeArtifact([{ format: 'lib' }, { format: 'mjs' }, { format: 'cjs' }]);
				pkg.artifacts.push(a);

				const b = createCodeArtifact(
					[{ format: 'lib' }, { format: 'esm' }, { format: 'umd' }],
					'browser',
				);
				pkg.artifacts.push(b);

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': {
						node: {
							import: './mjs/index.mjs',
							require: './cjs/index.cjs',
						},
						browser: {
							import: './esm/index.js',
							module: './esm/index.js',
							default: './umd/index.js',
						},
						default: './lib/index.js',
					},
					'./package.json': './package.json',
				});
			});

			it('adds exports for multiple artifacts of different output names', async () => {
				const a = createCodeArtifact([{ format: 'lib' }]);
				pkg.artifacts.push(a);

				const b = createCodeArtifact([{ format: 'lib' }], 'browser');
				b.inputs = { client: 'src/index.ts' };
				pkg.artifacts.push(b);

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': { node: './lib/index.js', default: './lib/index.js' },
					'./client': { browser: './lib/client.js', default: './lib/client.js' },
					'./package.json': './package.json',
				});
			});

			it('adds exports for multiple artifacts + formats of different output names', async () => {
				const a = createCodeArtifact([{ format: 'lib' }, { format: 'mjs' }, { format: 'cjs' }]);
				pkg.artifacts.push(a);

				const b = createCodeArtifact(
					[{ format: 'lib' }, { format: 'esm' }, { format: 'umd' }],
					'browser',
				);
				b.inputs = { client: 'src/index.ts' };
				pkg.artifacts.push(b);

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': {
						node: {
							import: './mjs/index.mjs',
							require: './cjs/index.cjs',
						},
						default: './lib/index.js',
					},
					'./client': {
						browser: {
							import: './esm/client.js',
							module: './esm/client.js',
							default: './umd/client.js',
						},
						default: './lib/client.js',
					},
					'./package.json': './package.json',
				});
			});

			it('adds exports for bundle and types artifacts in parallel', async () => {
				pkg.artifacts.push(createCodeArtifact([{ declaration: true, format: 'lib' }]));

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': { node: './lib/index.js', types: './dts/index.d.ts', default: './lib/index.js' },
					'./package.json': './package.json',
				});
			});

			it('merges with existing exports', async () => {
				pkg.json.exports = {
					'./foo': './lib/foo.js',
				};

				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }]));

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': { node: './lib/index.js', default: './lib/index.js' },
					'./foo': './lib/foo.js',
					'./package.json': './package.json',
				});
			});

			it('adds "mjs wrapper" exports for a single cjs format', async () => {
				pkg.artifacts.push(createCodeArtifact([{ format: 'cjs' }]));

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': {
						node: {
							import: './cjs/index-wrapper.mjs',
							require: './cjs/index.cjs',
						},
					},
					'./package.json': './package.json',
				});
			});

			it('supports dual cjs/mjs exports', async () => {
				pkg.artifacts.push(
					createCodeArtifact([{ format: 'cjs' }]),
					createCodeArtifact([{ format: 'mjs' }], 'node', 'experimental'),
				);

				await pkg.build({ addExports: true }, config);

				expect(pkg.json.exports).toEqual({
					'.': {
						node: {
							import: './mjs/index.mjs',
							require: './cjs/index.cjs',
						},
					},
					'./package.json': './package.json',
				});
			});
		});

		describe('files', () => {
			it('adds "files" folder for each format format', async () => {
				pkg.artifacts.push(
					createCodeArtifact([{ format: 'cjs' }, { format: 'lib' }]),
					createCodeArtifact([{ format: 'umd' }], 'browser'),
				);

				await pkg.build({ addFiles: true }, config);

				expect(pkg.json).toEqual(
					expect.objectContaining({
						files: ['cjs/**/*', 'lib/**/*', 'src/**/*', 'umd/**/*'],
					}),
				);
			});

			it('merges with existing "files" list', async () => {
				pkg.json.files = ['templates/', 'test.js'];

				pkg.artifacts.push(createCodeArtifact([{ format: 'lib' }, { format: 'esm' }], 'browser'));

				await pkg.build({ addFiles: true }, config);

				expect(pkg.json).toEqual(
					expect.objectContaining({
						files: ['esm/**/*', 'lib/**/*', 'src/**/*', 'templates/', 'test.js'],
					}),
				);
			});

			it('includes assets folder if it exists', async () => {
				pkg = loadPackageAtPath(getFixturePath('project-assets'));

				try {
					fsx.mkdirSync(pkg.path.append('assets').path());
				} catch {
					// Ignore
				}

				await pkg.build({ addFiles: true }, config);

				expect(pkg.json).toEqual(
					expect.objectContaining({
						files: ['assets/**/*'],
					}),
				);
			});
		});

		// https://github.com/milesj/packemon/issues/42#issuecomment-808793241
		it.skip('private api: uses inputs as subpath imports', async () => {
			const a = createCodeArtifact([{ format: 'cjs' }]);
			a.api = 'private';
			a.inputs = { index: 'src/node.ts' };

			const b = createCodeArtifact([{ format: 'lib' }]);
			b.api = 'private';
			b.inputs = { bin: 'src/cli.ts' };

			const c = createCodeArtifact([{ format: 'lib' }, { format: 'esm' }], 'browser', 'current');
			c.api = 'private';
			c.inputs = { web: 'src/web.ts' };

			const d = createCodeArtifact([{ format: 'mjs' }], 'node', 'current');
			d.api = 'private';
			d.inputs = { import: 'src/web.ts' };

			pkg.artifacts.push(a, b, c, d);

			await pkg.build({ addExports: true }, config);

			expect(pkg.json).toEqual(
				expect.objectContaining({
					main: './cjs/index.cjs',
					bin: './lib/bin.js',
					exports: {
						'./package.json': './package.json',
						'.': { node: { import: './cjs/index-wrapper.mjs', require: './cjs/index.cjs' } },
						'./bin': { node: './lib/bin.js', default: './lib/bin.js' },
						'./web': {
							browser: {
								import: './esm/web.js',
								module: './esm/web.js',
								default: './lib/web.js',
							},
							default: './lib/web.js',
						},
						'./import': { node: { import: './mjs/import.mjs' } },
					},
				}),
			);
		});

		it.skip('public api + bundle: uses inputs as subpath imports (non-deep imports)', async () => {
			const a = createCodeArtifact([{ format: 'cjs' }]);
			a.api = 'public';
			a.bundle = true;
			a.inputs = { index: 'src/node.ts' };

			const b = createCodeArtifact([{ format: 'lib' }]);
			b.api = 'public';
			b.bundle = true;
			b.inputs = { bin: 'src/cli.ts' };

			const c = createCodeArtifact([{ format: 'lib' }, { format: 'esm' }], 'browser', 'current');
			c.api = 'public';
			c.bundle = true;
			c.inputs = { web: 'src/web.ts' };

			const d = createCodeArtifact([{ format: 'mjs' }], 'node', 'current');
			d.api = 'public';
			d.bundle = true;
			d.inputs = { import: 'src/web.ts' };

			pkg.artifacts.push(a, b, c, d);

			await pkg.build({ addExports: true }, config);

			expect(pkg.json).toEqual(
				expect.objectContaining({
					main: './cjs/node.cjs',
					bin: './lib/cli.js',
					exports: {
						'./package.json': './package.json',
						'./bin': { node: './lib/cli.js', default: './lib/cli.js' },
						'./import': { node: { import: './mjs/web.mjs' } },
						'./web': {
							browser: { import: './esm/web.js', module: './esm/web.js', default: './lib/web.js' },
							default: './lib/web.js',
						},
						'.': { node: { import: './cjs/node-wrapper.mjs', require: './cjs/node.cjs' } },
					},
				}),
			);
		});

		it.skip('public api + no bundle: uses patterns as subpath imports (deep imports)', async () => {
			const a = createCodeArtifact([{ format: 'cjs' }]);
			a.api = 'public';
			a.bundle = false;
			a.inputs = { index: 'src/node.ts' };

			const b = createCodeArtifact([{ format: 'lib' }]);
			b.api = 'public';
			b.bundle = false;
			b.inputs = { bin: 'src/cli.ts' };

			const c = createCodeArtifact([{ format: 'lib' }, { format: 'esm' }], 'browser', 'current');
			c.api = 'public';
			c.bundle = false;
			c.inputs = { web: 'src/web.ts' };

			const d = createCodeArtifact([{ format: 'mjs' }], 'node', 'current');
			d.api = 'public';
			d.bundle = false;
			d.inputs = { import: 'src/web.ts' };

			pkg.artifacts.push(a, b, c, d);

			await pkg.build({ addExports: true }, config);

			expect(pkg.json).toEqual(
				expect.objectContaining({
					main: './cjs/node.cjs',
					bin: './lib/cli.js',
					exports: {
						'./package.json': './package.json',
						'./*': {
							browser: { import: './esm/*.js', module: './esm/*.js', default: './lib/*.js' },
							node: { import: './mjs/*.mjs' },
							default: './lib/*.js',
						},
						'.': {
							browser: {
								import: './esm/index.js',
								module: './esm/index.js',
								default: './lib/index.js',
							},
							node: { import: './mjs/index.mjs' },
							default: './lib/index.js',
						},
					},
				}),
			);
		});
	});

	describe('cleanup()', () => {
		it('calls `cleanup` on each artifact', async () => {
			const [a, b, c] = createArtifacts();
			const aSpy = jest.spyOn(a, 'clean');
			const bSpy = jest.spyOn(b, 'clean');
			const cSpy = jest.spyOn(c, 'clean');

			pkg.artifacts.push(a, b, c);

			await pkg.clean();

			expect(aSpy).toHaveBeenCalled();
			expect(bSpy).toHaveBeenCalled();
			expect(cSpy).toHaveBeenCalled();
		});
	});

	describe('getName()', () => {
		it('returns `name` from `package.json`', () => {
			expect(pkg.getName()).toBe('project');
		});
	});

	describe('getSlug()', () => {
		it('returns package folder name', () => {
			expect(pkg.getSlug()).toBe('project');
		});
	});

	describe('getFeatureFlags()', () => {
		describe('react', () => {
			it('returns "classic" if a * dependency', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/react-star'),
					).getFeatureFlags(),
				).toEqual({
					react: 'classic',
				});
			});

			it('returns "classic" if a non-satisfying dependency', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/react-classic'),
					).getFeatureFlags(),
				).toEqual({
					react: 'classic',
				});
			});

			it('returns "automatic" if a satisfying dependency', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/react-automatic'),
					).getFeatureFlags(),
				).toEqual({
					react: 'automatic',
				});
			});
		});

		describe('solid', () => {
			it('enables if a dependency', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/solid'),
					).getFeatureFlags(),
				).toEqual({
					solid: true,
				});
			});
		});

		describe('typescript', () => {
			it('returns true if a package dependency (peer)', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/ts'),
					).getFeatureFlags(),
				).toEqual({
					decorators: false,
					strict: false,
					typescript: true,
					typescriptComposite: false,
				});
			});

			it('returns true if package contains a `tsconfig.json`', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/ts-config'),
					).getFeatureFlags(),
				).toEqual({
					decorators: true,
					strict: true,
					typescript: true,
					typescriptComposite: false,
				});
			});

			it('extracts decorators and strict support from local `tsconfig.json`', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/ts-config'),
					).getFeatureFlags(),
				).toEqual({
					decorators: true,
					strict: true,
					typescript: true,
					typescriptComposite: false,
				});
			});

			it('handles composite/project references', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/ts-refs'),
					).getFeatureFlags(),
				).toEqual({
					decorators: false,
					strict: false,
					typescript: true,
					typescriptComposite: true,
				});
			});
		});

		describe('flow', () => {
			it('returns true if a package dependency (dev)', () => {
				expect(
					loadPackageAtPath(
						getFixturePath('workspaces-feature-flags', 'packages/flow'),
					).getFeatureFlags(),
				).toEqual({ flow: true });
			});
		});
	});

	describe('generateArtifacts()', () => {
		it('generates build artifacts for each config in a package', () => {
			const pkg1 = loadPackageAtPath(getFixturePath('workspaces', 'packages/valid-array'));
			const pkg2 = loadPackageAtPath(getFixturePath('workspaces', 'packages/valid-object'));
			const pkg3 = loadPackageAtPath(getFixturePath('workspaces', 'packages/valid-object-private'));

			pkg1.generateArtifacts({});
			pkg2.generateArtifacts({});
			pkg3.generateArtifacts({});

			expect(pkg1.artifacts).toHaveLength(2);
			expect(pkg1.artifacts[0].builds).toEqual([{ format: 'lib' }]);

			expect(pkg1.artifacts[1].inputs).toEqual({ index: 'src/index.ts' });
			expect(pkg1.artifacts[1].builds).toEqual([{ format: 'esm' }, { format: 'lib' }]);

			expect(pkg2.artifacts).toHaveLength(1);
			expect(pkg2.artifacts[0].builds).toEqual([{ format: 'mjs' }]);

			expect(pkg3.artifacts).toHaveLength(1);
			expect(pkg3.artifacts[0].builds).toEqual([
				{ format: 'esm' },
				{ format: 'lib' },
				{ format: 'umd' },
			]);
		});

		it('generates type artifacts for each config in a package', () => {
			const pkg1 = loadPackageAtPath(getFixturePath('workspaces', 'packages/valid-array'));
			const pkg2 = loadPackageAtPath(getFixturePath('workspaces', 'packages/valid-object'));
			const pkg3 = loadPackageAtPath(getFixturePath('workspaces', 'packages/valid-object-private'));

			pkg1.generateArtifacts({ declaration: true });
			pkg2.generateArtifacts({ declaration: true });
			pkg3.generateArtifacts({ declaration: true });

			expect(pkg1.artifacts).toHaveLength(2);
			expect(pkg1.artifacts[0].builds).toEqual([{ declaration: true, format: 'lib' }]);
			expect(pkg1.artifacts[1].builds).toEqual([
				{ declaration: true, format: 'esm' },
				{ declaration: true, format: 'lib' },
			]);

			expect(pkg2.artifacts).toHaveLength(1);
			expect(pkg2.artifacts[0].builds).toEqual([{ declaration: true, format: 'mjs' }]);

			expect(pkg3.artifacts).toHaveLength(1);
			expect(pkg3.artifacts[0].builds).toEqual([
				{ declaration: true, format: 'esm' },
				{ declaration: true, format: 'lib' },
				{ declaration: true, format: 'umd' },
			]);
		});

		it('generates build artifacts for projects with multiple platforms', () => {
			pkg = loadPackageAtPath(getFixturePath('project-multi-platform'));

			pkg.generateArtifacts({});

			expect(pkg.artifacts[0].builds).toEqual([{ format: 'esm' }, { format: 'lib' }]);
			expect(pkg.artifacts[0].platform).toBe('browser');

			expect(pkg.artifacts[1].builds).toEqual([{ format: 'mjs' }]);
			expect(pkg.artifacts[1].platform).toBe('node');
		});

		it('filters formats using `filterFormats`', () => {
			pkg = loadPackageAtPath(getFixturePath('project-multi-platform'));

			pkg.generateArtifacts({
				filterFormats: 'esm',
			});

			expect(pkg.artifacts[0].builds).toEqual([{ format: 'esm' }]);
			expect(pkg.artifacts[1]).toBeUndefined();
		});

		it('filters platforms using `filterPlatforms`', () => {
			pkg = loadPackageAtPath(getFixturePath('project-multi-platform'));

			pkg.generateArtifacts({
				filterPlatforms: 'node',
			});

			expect(pkg.artifacts[0].builds).toEqual([{ format: 'mjs' }]);
			expect(pkg.artifacts[1]).toBeUndefined();
		});
	});

	describe('setConfigs()', () => {
		beforeEach(() => {
			pkg = loadPackageAtPath(getFixturePath('workspaces-feature-flags', 'packages/common'));
			// @ts-expect-error Allow override
			pkg.configs = [];
		});

		it('sets default formats for `browser` platform', () => {
			pkg.setConfigs([
				{
					// @ts-expect-error Allow empty
					format: '',
					inputs: {},
					platform: 'browser',
					namespace: '',
					support: 'stable',
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'private',
					bundle: true,
					externals: [],
					formats: ['esm', 'lib'],
					inputs: {},
					platform: 'browser',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('adds `umd` default format when `namespace` is provided for `browser` platform', () => {
			pkg.setConfigs([
				{
					// @ts-expect-error Allow empty
					format: '',
					inputs: {},
					platform: 'browser',
					namespace: 'test',
					support: 'stable',
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'private',
					bundle: true,
					externals: [],
					formats: ['esm', 'lib', 'umd'],
					inputs: {},
					platform: 'browser',
					namespace: 'test',
					support: 'stable',
				},
			]);
		});

		it('sets default formats for `native` platform', () => {
			pkg.setConfigs([
				{
					// @ts-expect-error Allow empty
					format: '',
					inputs: {},
					platform: 'native',
					namespace: '',
					support: 'stable',
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'private',
					bundle: true,
					externals: [],
					formats: ['lib'],
					inputs: {},
					platform: 'native',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('sets default formats for `node` platform', () => {
			pkg.setConfigs([
				{
					// @ts-expect-error Allow empty
					format: '',
					inputs: {},
					platform: 'node',
					namespace: '',
					support: 'stable',
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'public',
					bundle: false,
					externals: [],
					formats: ['mjs'],
					inputs: {},
					platform: 'node',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('doesnt set default formats when supplied manually', () => {
			pkg.setConfigs([
				{
					format: 'mjs',
					inputs: {},
					platform: 'node',
					namespace: '',
					support: 'stable',
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'public',
					bundle: false,
					externals: [],
					formats: ['mjs'],
					inputs: {},
					platform: 'node',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('sets default formats for multiple platforms', () => {
			pkg.setConfigs([
				{
					inputs: {},
					platform: ['browser', 'node'],
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'private',
					bundle: true,
					externals: [],
					formats: ['esm', 'lib'],
					inputs: {},
					platform: 'browser',
					namespace: '',
					support: 'stable',
				},
				{
					api: 'public',
					bundle: false,
					externals: [],
					formats: ['mjs'],
					inputs: {},
					platform: 'node',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('filters and divides formats for multiple platforms', () => {
			pkg.setConfigs([
				{
					format: 'esm',
					inputs: {},
					platform: ['browser', 'node', 'native'],
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'private',
					bundle: true,
					externals: [],
					formats: ['esm', 'lib'],
					inputs: {},
					platform: 'browser',
					namespace: '',
					support: 'stable',
				},
				{
					api: 'public',
					bundle: false,
					externals: [],
					formats: ['mjs'],
					inputs: {},
					platform: 'node',
					namespace: '',
					support: 'stable',
				},
				{
					api: 'private',
					bundle: true,
					externals: [],
					formats: ['lib'],
					inputs: {},
					platform: 'native',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('can override `bundle` defaults', () => {
			pkg.setConfigs([
				{
					api: 'private',
					bundle: true,
					platform: 'node',
				},
				{
					api: 'public',
					bundle: false,
					platform: 'browser',
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'private',
					bundle: true,
					externals: [],
					formats: ['mjs'],
					inputs: { index: 'src/index.ts' },
					platform: 'node',
					namespace: '',
					support: 'stable',
				},
				{
					api: 'public',
					bundle: false,
					externals: [],
					formats: ['esm', 'lib'],
					inputs: { index: 'src/index.ts' },
					platform: 'browser',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('sets `externals` option', () => {
			pkg.setConfigs([
				{
					externals: ['foo', 'bar'],
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'private',
					bundle: true,
					externals: ['foo', 'bar'],
					formats: ['esm', 'lib'],
					inputs: { index: 'src/index.ts' },
					platform: 'browser',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('sets `externals` option with a string', () => {
			pkg.setConfigs([
				{
					externals: 'foo',
				},
			]);

			expect(pkg.configs).toEqual([
				{
					api: 'private',
					bundle: true,
					externals: ['foo'],
					formats: ['esm', 'lib'],
					inputs: { index: 'src/index.ts' },
					platform: 'browser',
					namespace: '',
					support: 'stable',
				},
			]);
		});

		it('errors if invalid format is provided for `browser` platform', () => {
			expect(() => {
				pkg.setConfigs([
					{
						format: 'mjs',
						platform: 'browser',
					},
				]);
			}).toThrowErrorMatchingSnapshot();
		});

		it('errors if invalid format is provided for `native` platform', () => {
			expect(() => {
				pkg.setConfigs([
					{
						format: 'esm',
						platform: 'native',
					},
				]);
			}).toThrowErrorMatchingSnapshot();
		});

		it('errors if invalid format is provided for `node` platform', () => {
			expect(() => {
				pkg.setConfigs([
					{
						format: 'umd',
						platform: 'node',
					},
				]);
			}).toThrowErrorMatchingSnapshot();
		});

		it('errors if input name contains a slash', () => {
			expect(() => {
				pkg.setConfigs([
					{
						inputs: {
							'foo/bar': 'src/foo.ts',
						},
					},
				]);
			}).toThrowErrorMatchingSnapshot();
		});

		it('errors if input name contains a space', () => {
			expect(() => {
				pkg.setConfigs([
					{
						inputs: {
							'foo bar': 'src/foo.ts',
						},
					},
				]);
			}).toThrowErrorMatchingSnapshot();
		});
	});

	describe('syncJson()', () => {
		it('writes to `package.json', async () => {
			const spy = jest.spyOn(fsx, 'writeJson').mockImplementation();

			await pkg.syncJson();

			expect(spy).toHaveBeenCalledWith(
				pkg.jsonPath.path(),
				{
					name: 'project',
					packemon: {
						inputs: {
							index: 'src/index.ts',
							test: 'src/sub/test.ts',
						},
					},
				},
				{ spaces: 2 },
			);
		});
	});
});
