import { execa } from 'execa';
import fs from 'fs-extra';
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Path } from '@boost/common';
import { Package } from '../src/Package';
import { PackageValidator } from '../src/PackageValidator';
import { getFixturePath, mockSpy } from './helpers';

vi.mock('execa');

function createValidator(fixture: string) {
	const root = new Path(getFixturePath(fixture));

	return new PackageValidator(
		new Package(root, {
			name: 'test',
			version: '0.0.0',
			description: 'Test',
			keywords: ['test'],
			packemon: {},
			...fs.readJsonSync(root.append('package.json').path()),
		}),
	);
}

describe('PackageValidator', () => {
	let validator: PackageValidator;
	let urlSpy: MockInstance;

	function createUrlSpy() {
		// @ts-expect-error Private
		urlSpy = vi.spyOn(validator, 'doesUrlExist').mockImplementation(() => true);
	}

	describe('hasErrors()', () => {
		beforeEach(() => {
			validator = createValidator('project');
		});

		it('returns true if there are errors', () => {
			validator.errors.push('Oops');

			expect(validator.hasErrors()).toBe(true);
		});

		it('returns false if there are no errors', () => {
			expect(validator.hasErrors()).toBe(false);
		});
	});

	describe('hasWarnings()', () => {
		beforeEach(() => {
			validator = createValidator('project');
		});

		it('returns true if there are warnings', () => {
			validator.warnings.push('Oops');

			expect(validator.hasWarnings()).toBe(true);
		});

		it('returns false if there are no warnings', () => {
			expect(validator.hasWarnings()).toBe(false);
		});
	});

	describe('checkDependencies()', () => {
		beforeEach(() => {
			validator = createValidator('project');
		});

		['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach(
			(depType) => {
				describe(`${depType}`, () => {
					beforeEach(() => {
						if (depType === 'peerDependencies') {
							validator.package.json.devDependencies = {
								foo: '*',
							};
						}
					});

					it('does not error if no deps', async () => {
						validator.package.json[depType as 'dependencies'] = {};

						await validator.validate({ deps: true });

						expect(validator.warnings).toEqual([]);
						expect(validator.errors).toEqual([]);
					});

					it('errors if a dep uses a file: constraint', async () => {
						validator.package.json[depType as 'dependencies'] = {
							foo: 'file:../package',
						};

						await validator.validate({ deps: true });

						expect(validator.warnings).toEqual([]);
						expect(validator.errors).toEqual([
							'Dependency "foo" must not require the file system. Found "file:" constraint.',
						]);
					});

					it('errors if a dep uses a link: constraint', async () => {
						validator.package.json[depType as 'dependencies'] = {
							foo: 'link:../package',
						};

						await validator.validate({ deps: true });

						expect(validator.warnings).toEqual([]);
						expect(validator.errors).toEqual([
							'Dependency "foo" must not require symlinks. Found "link:" constraint.',
						]);
					});
				});
			},
		);

		it('errors if a dep defined as both a normal and peer', async () => {
			validator.package.json.dependencies = {
				foo: '1.0.0',
			};
			validator.package.json.peerDependencies = {
				foo: '1.0.0',
			};

			await validator.validate({ deps: true });

			expect(validator.warnings).toEqual([
				// 'Peer dependency "foo" is missing a version satisfying dev dependency.',
			]);
			expect(validator.errors).toEqual([
				'Dependency "foo" defined as both a prod and peer dependency.',
			]);
		});

		it('warns if a dep defined as a peer without a dev', async () => {
			validator.package.json.peerDependencies = {
				foo: '1.0.0',
			};

			await validator.validate({ deps: true });

			expect(validator.warnings).toEqual([
				// 'Peer dependency "foo" is missing a version satisfying dev dependency.',
			]);
			expect(validator.errors).toEqual([]);
		});

		it('doesnt warn if a dep defined as a peer without a dev, but is optional', async () => {
			validator.package.json.peerDependencies = {
				foo: '1.0.0',
			};

			validator.package.json.peerDependenciesMeta = {
				foo: {
					optional: true,
				},
			};

			await validator.validate({ deps: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([]);
		});

		it('errors if a dep defined as a peer without a dev satisfying version', async () => {
			validator.package.json.peerDependencies = {
				foo: '^1.0.0',
			};
			validator.package.json.devDependencies = {
				foo: '0.1.2',
			};

			await validator.validate({ deps: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([
				'Dev dependency "foo" does not satisfy version constraint of its peer. Found 0.1.2, requires ^1.0.0.',
			]);
		});

		it('doesnt error if a dep defined as a peer with a dev satisfying version', async () => {
			validator.package.json.peerDependencies = {
				foo: '^1.0.0',
			};
			validator.package.json.devDependencies = {
				foo: '1.1.2',
			};

			await validator.validate({ deps: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([]);
		});

		describe('lerna', () => {
			beforeEach(() => {
				// @ts-expect-error Allow override
				vi.spyOn(validator, 'isLernaManaged').mockImplementation(() => true);
				vi
					// @ts-expect-error Allow override
					.spyOn(validator, 'getWorkspacePackageNames')
					.mockImplementation(() => ['foo', 'bar', 'baz']);
			});

			it('errors if a dep defined as a peer with a dev', async () => {
				validator.package.json.peerDependencies = {
					foo: '^1.0.0',
				};
				validator.package.json.devDependencies = {
					foo: '1.2.3',
				};

				await validator.validate({ deps: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([
					'Peer dependency "foo" should not define a dev dependency when using Lerna.',
				]);
			});

			it('doesnt error if a dep defined as a peer without a dev', async () => {
				validator.package.json.peerDependencies = {
					foo: '^1.0.0',
				};

				await validator.validate({ deps: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});
	});

	describe('checkEngines()', () => {
		beforeEach(() => {
			validator = createValidator('project');
		});

		describe('node', () => {
			beforeEach(() => {
				validator.package.json.engines = {
					node: '>=10.10.0',
				};
			});

			it('does nothing if no node constraint', async () => {
				validator.package.json.engines = {};

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('warns if node version doesnt satisfy constraint', async () => {
				mockSpy(execa).mockImplementation(() => ({ stdout: '9.1.2' }));

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([
					'Node.js does not satisfy engine constraints. Found 9.1.2, requires >=10.10.0.',
				]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if node version satisfies constraint', async () => {
				mockSpy(execa).mockImplementation(() => ({ stdout: 'v12.1.2' }));

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});

		describe('npm', () => {
			beforeEach(() => {
				validator.package.json.engines = {
					npm: '^7.0.0',
				};
			});

			it('does nothing if no npm constraint', async () => {
				validator.package.json.engines = {};

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('warns if npm version doesnt satisfy constraint', async () => {
				mockSpy(execa).mockImplementation(() => ({ stdout: 'v8.0.0' }));

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([
					'npm does not satisfy engine constraints. Found 8.0.0, requires ^7.0.0.',
				]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if npm version satisfies constraint', async () => {
				mockSpy(execa).mockImplementation(() => ({ stdout: '7.7.7' }));

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});

		describe('yarn', () => {
			beforeEach(() => {
				validator.package.json.engines = {
					yarn: '^1.0.0 || ^2.0.0',
				};
			});

			it('does nothing if no yarn constraint', async () => {
				validator.package.json.engines = {};

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('warns if yarn version doesnt satisfy constraint', async () => {
				mockSpy(execa).mockImplementation(() => ({ stdout: '0.1.9' }));

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([
					'Yarn does not satisfy engine constraints. Found 0.1.9, requires ^1.0.0 || ^2.0.0.',
				]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if yarn version satisfies constraint', async () => {
				mockSpy(execa).mockImplementation(() => ({ stdout: 'v1.4.6' }));

				await validator.validate({ engines: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});
	});

	describe('checkEntryPoints()', () => {
		PackageValidator.entryPoints.forEach((entryPoint) => {
			describe(`${entryPoint}`, () => {
				beforeEach(() => {
					validator = createValidator(`validate-entry-${entryPoint}`);
				});

				it('doesnt error if field points to a valid file', async () => {
					await validator.validate({ entries: true });

					expect(validator.warnings).toEqual([]);
					expect(validator.errors).toEqual([]);
				});

				if (entryPoint !== 'main') {
					it('doesnt error if field is empty', async () => {
						validator.package.json[entryPoint as 'main'] = undefined;

						await validator.validate({ entries: true });

						expect(validator.warnings).toEqual([]);
						expect(validator.errors).toEqual([]);
					});
				}

				it('errors if field points to an invalid file', async () => {
					validator.package.json[entryPoint as 'main'] = './missing/file.js';

					await validator.validate({ entries: true });

					expect(validator.warnings).toEqual([]);
					expect(validator.errors).toEqual([
						`Entry point "${entryPoint}" resolves to an invalid or missing file.`,
					]);
				});
			});
		});

		describe('bin (object)', () => {
			beforeEach(() => {
				validator = createValidator('validate-entry-bin-object');
			});

			it('doesnt error if all bin fields point to a valid file', async () => {
				await validator.validate({ entries: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('errors if a bin field points to an invalid file', async () => {
				(validator.package.json.bin as Record<string, string>).b = './missing/file.js';

				await validator.validate({ entries: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual(['Bin "b" resolves to an invalid or missing file.']);
			});
		});

		describe('man (array)', () => {
			beforeEach(() => {
				validator = createValidator('validate-entry-man-array');
			});

			it('doesnt error if all man fields point to a valid file', async () => {
				await validator.validate({ entries: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('errors if a man field points to an invalid file', async () => {
				(validator.package.json.man as string[])[0] = './missing/file.js';

				await validator.validate({ entries: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([
					'Manual "./missing/file.js" resolves to an invalid or missing file.',
				]);
			});
		});

		it(`errors if "main" and "exports" are empty`, async () => {
			validator = createValidator(`validate-entry-main`);
			validator.package.json.main = undefined;
			validator.package.json.exports = undefined;

			await validator.validate({ entries: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([
				'Missing primary entry point. Provide a `main` or `exports` field.',
			]);
		});
	});

	describe('checkLicense()', () => {
		beforeEach(() => {
			validator = createValidator('validate-license-file');
		});

		it('doesnt error if license field is defined', async () => {
			await validator.validate({ license: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([]);
		});

		it('doesnt error if license field is defined but is UNLICENSED', async () => {
			validator.package.json.license = 'UNLICENSED';

			await validator.validate({ license: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([]);
		});

		it('errors if license field is not defined', async () => {
			validator.package.json.license = undefined;

			await validator.validate({ license: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual(['Missing license.']);
		});

		it('errors if license field is an invalid SPDX license', async () => {
			validator.package.json.license = 'unknown';

			await validator.validate({ license: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([
				'Invalid license "unknown". Must be an official SPDX license type.',
			]);
		});

		it('errors if license non-string field is an invalid SPDX license', async () => {
			validator.package.json.license = [
				{ type: 'MIT', url: '' },
				{ type: 'what', url: '' },
			];

			await validator.validate({ license: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([
				'Invalid license "what". Must be an official SPDX license type.',
			]);
		});

		it('doesnt error if license field is an object', async () => {
			validator.package.json.license = { type: 'MIT', url: '' };

			await validator.validate({ license: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([]);
		});

		it('doesnt error if license field is an array of objects', async () => {
			validator.package.json.license = [
				{ type: 'MIT', url: '' },
				{ type: 'BSD-3-Clause', url: '' },
			];

			await validator.validate({ license: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([]);
		});

		describe('files', () => {
			it('errors if LICENSE file is missing', async () => {
				validator = createValidator('project');

				await validator.validate({ license: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([
					'Missing license.',
					'No license file found in package. Must contain one of LICENSE or LICENSE.md.',
				]);
			});

			it('doesnt error if LICENSE file exists', async () => {
				validator = createValidator('validate-license-file');

				await validator.validate({ license: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt error if LICENSE.md file exists', async () => {
				validator = createValidator('validate-license-file-md');

				await validator.validate({ license: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});
	});

	describe('checkLinks()', () => {
		beforeEach(() => {
			validator = createValidator('project');
			createUrlSpy();
		});

		describe('homepage', () => {
			it('doesnt warn if not defined', async () => {
				await validator.validate({ links: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if defined and a valid URL', async () => {
				validator.package.json.homepage = 'https://packemon.dev';

				await validator.validate({ links: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('warns if defined and an invalid URL', async () => {
				urlSpy.mockImplementation(() => false);

				validator.package.json.homepage = 'invalid url';

				await validator.validate({ links: true });

				expect(validator.warnings).toEqual([
					'Homepage link is invalid. URL is either malformed or upstream is down.',
				]);
				expect(validator.errors).toEqual([]);
			});
		});

		describe('bugs', () => {
			it('doesnt warn if not defined', async () => {
				await validator.validate({ links: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if defined and a valid URL', async () => {
				validator.package.json.bugs = 'https://packemon.dev';

				await validator.validate({ links: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('warns if defined and an invalid URL', async () => {
				urlSpy.mockImplementation(() => false);

				validator.package.json.bugs = 'invalid url';

				await validator.validate({ links: true });

				expect(validator.warnings).toEqual([
					'Bugs link is invalid. URL is either malformed or upstream is down.',
				]);
				expect(validator.errors).toEqual([]);
			});

			describe('object', () => {
				it('doesnt warn if defined and a valid URL', async () => {
					validator.package.json.bugs = { url: 'https://packemon.dev' };

					await validator.validate({ links: true });

					expect(validator.warnings).toEqual([]);
					expect(validator.errors).toEqual([]);
				});

				it('warns if defined and an invalid URL', async () => {
					urlSpy.mockImplementation(() => false);

					validator.package.json.bugs = { url: 'invalid url' };

					await validator.validate({ links: true });

					expect(validator.warnings).toEqual([
						'Bugs link is invalid. URL is either malformed or upstream is down.',
					]);
					expect(validator.errors).toEqual([]);
				});
			});
		});
	});

	describe('checkMetadata()', () => {
		beforeEach(() => {
			validator = createValidator('validate-readme-file');
		});

		describe('name', () => {
			it('doesnt error if defined', async () => {
				validator.package.json.name = 'packemon';

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('errors if not defined', async () => {
				validator.package.json.name = '';

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual(['Missing name.']);
			});

			it('errors if an invalid format', async () => {
				validator.package.json.name = 'what even is this';

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([
					'Invalid name format. Must contain alphanumeric characters and dashes.',
				]);
			});
		});

		describe('version', () => {
			it('doesnt error if defined', async () => {
				validator.package.json.version = '1.0.0';

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('errors if not defined', async () => {
				validator.package.json.version = '';

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual(['Missing version.']);
			});

			it('doesnt error if not defined but package is private', async () => {
				validator.package.json.private = true;

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});

		describe('description', () => {
			it('doesnt warn if defined', async () => {
				validator.package.json.description = 'Packemon';

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('warns if not defined', async () => {
				validator.package.json.description = undefined;

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual(['Missing description.']);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if not defined but package is private', async () => {
				validator.package.json.private = true;

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});

		describe('keywords', () => {
			it('doesnt warn if defined', async () => {
				validator.package.json.keywords = ['packemon'];

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('warns if not defined', async () => {
				validator.package.json.keywords = undefined;

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual(['Missing keywords.']);
				expect(validator.errors).toEqual([]);
			});

			it('warns if defined but empty', async () => {
				validator.package.json.keywords = [];

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual(['Missing keywords.']);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if not defined but package is private', async () => {
				validator.package.json.private = true;

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});

		describe('files', () => {
			it('errors if README file is missing', async () => {
				validator = createValidator('project');

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([
					'No read me found in package. Must contain one of README or README.md.',
				]);
			});

			it('doesnt error if README file exists', async () => {
				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt error if README.md file exists', async () => {
				validator = createValidator('validate-readme-file-md');

				await validator.validate({ meta: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});
		});
	});

	describe('checkPeople()', () => {
		beforeEach(() => {
			validator = createValidator('project');
			createUrlSpy();
		});

		describe('author', () => {
			it('warns if not defined', async () => {
				validator.package.json.author = undefined;

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual(['Missing author.']);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if defined', async () => {
				validator.package.json.author = 'Ash Ketchum';

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('errors if defined as an object without a name', async () => {
				validator.package.json.author = { name: '' };

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual(['Missing author name.']);
			});

			it('doesnt error if defined', async () => {
				validator.package.json.author = { name: 'Ash Ketchum' };

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('warns if defined and an invalid URL', async () => {
				urlSpy.mockImplementation(() => false);

				validator.package.json.author = { name: 'Ash Ketchum', url: 'https broken url' };

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual([
					'Author URL is invalid. URL is either malformed or upstream is down.',
				]);
				expect(validator.errors).toEqual([]);
			});
		});

		describe('contributors', () => {
			beforeEach(() => {
				validator.package.json.author = 'Professor Oak';
			});

			it('warns if defined and not an array', async () => {
				// @ts-expect-error Allow invalid type
				validator.package.json.contributors = {};

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual(['Contributors must be an array.']);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if defined but empty', async () => {
				validator.package.json.contributors = [];

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt warn if defined with strings', async () => {
				validator.package.json.contributors = ['Ash Ketchum'];

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('errors if defined with an object but missing name', async () => {
				validator.package.json.contributors = [{ name: '' }];

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual(['Missing contributor name.']);
			});

			it('warns if defined with an object but an invalid URL', async () => {
				urlSpy.mockImplementation(() => false);

				validator.package.json.contributors = [{ name: 'Ash Ketchum', url: 'https broken url' }];

				await validator.validate({ people: true });

				expect(validator.warnings).toEqual([
					'Contributor URL is invalid. URL is either malformed or upstream is down.',
				]);
				expect(validator.errors).toEqual([]);
			});
		});
	});

	describe('checkRepository()', () => {
		beforeEach(() => {
			validator = createValidator('workspaces');
			createUrlSpy();
		});

		it('errors if not defined', async () => {
			validator.package.json.repository = undefined;

			await validator.validate({ repo: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual(['Missing repository.']);
		});

		it('warns if defined and an invalid URL', async () => {
			urlSpy.mockImplementation(() => false);

			validator.package.json.repository = 'https broken url';

			await validator.validate({ repo: true });

			expect(validator.warnings).toEqual([
				'Repository is invalid. URL is either malformed or upstream is down.',
			]);
			expect(validator.errors).toEqual([]);
		});

		it('doesnt error if defined and a valid URL', async () => {
			validator.package.json.repository = 'https://packemon.dev';

			await validator.validate({ repo: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([]);
		});

		it('doesnt error if defined and a valid git SSH', async () => {
			validator.package.json.repository = 'git@github.com:milesj/packemon.git';

			await validator.validate({ repo: true });

			expect(validator.warnings).toEqual([]);
			expect(validator.errors).toEqual([]);
		});

		describe('object', () => {
			it('errors if not defined', async () => {
				validator.package.json.repository = { type: 'url', url: '' };

				await validator.validate({ repo: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual(['Missing repository.']);
			});

			it('doesnt error if defined and a valid URL', async () => {
				validator.package.json.repository = { type: 'url', url: 'https://packemon.dev' };

				await validator.validate({ repo: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			it('doesnt error if defined and a valid git SSH', async () => {
				validator.package.json.repository = {
					type: 'git',
					url: 'git@github.com:milesj/packemon.git',
				};

				await validator.validate({ repo: true });

				expect(validator.warnings).toEqual([]);
				expect(validator.errors).toEqual([]);
			});

			describe('directory', () => {
				it('errors if defined and points to an invalid path', async () => {
					validator.package.json.repository = {
						type: 'url',
						url: 'https://packemon.dev',
						directory: 'packages/missing-package',
					};

					await validator.validate({ repo: true });

					expect(validator.warnings).toEqual([]);
					expect(validator.errors).toEqual([
						'Repository directory "packages/missing-package" does not exist.',
					]);
				});

				it('doesnt error if defined and points to an valid path', async () => {
					validator.package.json.repository = {
						type: 'url',
						url: 'https://packemon.dev',
						directory: 'packages/valid-object',
					};

					await validator.validate({ repo: true });

					expect(validator.warnings).toEqual([]);
					expect(validator.errors).toEqual([]);
				});
			});
		});
	});
});
