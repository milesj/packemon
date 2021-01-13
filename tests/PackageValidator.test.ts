import execa from 'execa';
import fs from 'fs-extra';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import Package from '../src/Package';
import PackageValidator from '../src/PackageValidator';
import Project from '../src/Project';
import { mockSpy } from './helpers';

jest.mock('execa');

function createValidator(fixture: string) {
  const root = new Path(getFixturePath(fixture));

  return new PackageValidator(
    new Package(new Project(root), root, {
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
  let urlSpy: jest.SpyInstance;

  describe('checkEngines()', () => {
    beforeEach(() => {
      validator = createValidator('project');
    });

    describe('node', () => {
      beforeEach(() => {
        validator.package.packageJson.engines = {
          node: '>=10.10.0',
        };
      });

      it('does nothing if no node constraint', async () => {
        validator.package.packageJson.engines = {};

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
        validator.package.packageJson.engines = {
          npm: '^7.0.0',
        };
      });

      it('does nothing if no npm constraint', async () => {
        validator.package.packageJson.engines = {};

        await validator.validate({ engines: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });

      it('warns if npm version doesnt satisfy constraint', async () => {
        mockSpy(execa).mockImplementation(() => ({ stdout: 'v8.0.0' }));

        await validator.validate({ engines: true });

        expect(validator.warnings).toEqual([
          'NPM does not satisfy engine constraints. Found 8.0.0, requires ^7.0.0.',
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
        validator.package.packageJson.engines = {
          yarn: '^1.0.0 || ^2.0.0',
        };
      });

      it('does nothing if no yarn constraint', async () => {
        validator.package.packageJson.engines = {};

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
            validator.package.packageJson[entryPoint as 'main'] = undefined;

            await validator.validate({ entries: true });

            expect(validator.warnings).toEqual([]);
            expect(validator.errors).toEqual([]);
          });
        }

        it('errors if field points to an invalid file', async () => {
          validator.package.packageJson[entryPoint as 'main'] = './missing/file.js';

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
        (validator.package.packageJson.bin as Record<string, string>).b = './missing/file.js';

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
        (validator.package.packageJson.man as string[])[0] = './missing/file.js';

        await validator.validate({ entries: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([
          'Manual "./missing/file.js" resolves to an invalid or missing file.',
        ]);
      });
    });

    it(`errors if "main" and "exports" are empty`, async () => {
      validator = createValidator(`validate-entry-main`);
      validator.package.packageJson.main = undefined;
      validator.package.packageJson.exports = undefined;

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

    it('errors if license field is not defined', async () => {
      validator.package.packageJson.license = undefined;

      await validator.validate({ license: true });

      expect(validator.warnings).toEqual([]);
      expect(validator.errors).toEqual(['Missing license.']);
    });

    it('errors if license field is an invalid SPDX license', async () => {
      validator.package.packageJson.license = 'unknown';

      await validator.validate({ license: true });

      expect(validator.warnings).toEqual([]);
      expect(validator.errors).toEqual([
        'Invalid license "unknown". Must be an official SPDX license type.',
      ]);
    });

    it('errors if license non-string field is an invalid SPDX license', async () => {
      validator.package.packageJson.license = [
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
      validator.package.packageJson.license = { type: 'MIT', url: '' };

      await validator.validate({ license: true });

      expect(validator.warnings).toEqual([]);
      expect(validator.errors).toEqual([]);
    });

    it('doesnt error if license field is an array of objects', async () => {
      validator.package.packageJson.license = [
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

      // @ts-expect-error Private
      urlSpy = jest.spyOn(validator, 'doesUrlExist').mockImplementation(() => true);
    });

    describe('homepage', () => {
      it('doesnt warn if not defined', async () => {
        await validator.validate({ links: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });

      it('doesnt warn if defined and a valid URL', async () => {
        validator.package.packageJson.homepage = 'https://packemon.dev';

        await validator.validate({ links: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });

      it('warns if defined and an invalid URL', async () => {
        urlSpy.mockImplementation(() => false);

        validator.package.packageJson.homepage = 'invalid url';

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
        validator.package.packageJson.bugs = 'https://packemon.dev';

        await validator.validate({ links: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });

      it('warns if defined and an invalid URL', async () => {
        urlSpy.mockImplementation(() => false);

        validator.package.packageJson.bugs = 'invalid url';

        await validator.validate({ links: true });

        expect(validator.warnings).toEqual([
          'Bugs link is invalid. URL is either malformed or upstream is down.',
        ]);
        expect(validator.errors).toEqual([]);
      });

      describe('object', () => {
        it('doesnt warn if defined and a valid URL', async () => {
          validator.package.packageJson.bugs = { url: 'https://packemon.dev' };

          await validator.validate({ links: true });

          expect(validator.warnings).toEqual([]);
          expect(validator.errors).toEqual([]);
        });

        it('warns if defined and an invalid URL', async () => {
          urlSpy.mockImplementation(() => false);

          validator.package.packageJson.bugs = { url: 'invalid url' };

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
        validator.package.packageJson.name = 'packemon';

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });

      it('errors if not defined', async () => {
        validator.package.packageJson.name = '';

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual(['Missing name.']);
      });

      it('errors if an invalid format', async () => {
        validator.package.packageJson.name = 'what even is this';

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([
          'Invalid name format. Must contain alphanumeric characters and dashes.',
        ]);
      });
    });

    describe('version', () => {
      it('doesnt error if defined', async () => {
        validator.package.packageJson.version = '1.0.0';

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });

      it('errors if not defined', async () => {
        validator.package.packageJson.version = '';

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual(['Missing version.']);
      });
    });

    describe('description', () => {
      it('doesnt warn if defined', async () => {
        validator.package.packageJson.description = 'Packemon';

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });

      it('warns if not defined', async () => {
        validator.package.packageJson.description = undefined;

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual(['Missing description.']);
        expect(validator.errors).toEqual([]);
      });
    });

    describe('keywords', () => {
      it('doesnt warn if defined', async () => {
        validator.package.packageJson.keywords = ['packemon'];

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });

      it('warns if not defined', async () => {
        validator.package.packageJson.keywords = undefined;

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual(['Missing keywords.']);
        expect(validator.errors).toEqual([]);
      });

      it('warns if defined but empty', async () => {
        validator.package.packageJson.keywords = [];

        await validator.validate({ meta: true });

        expect(validator.warnings).toEqual(['Missing keywords.']);
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
});
