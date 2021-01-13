import fs from 'fs-extra';
import execa from 'execa';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import Project from '../src/Project';
import Package from '../src/Package';
import PackageValidator from '../src/PackageValidator';
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

  // beforeEach(() => {
  //   // @ts-expect-error Private
  //   urlSpy = jest.spyOn(validator, 'doesUrlExist').mockImplementation(() => true);
  // });

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
            validator.package.packageJson[entryPoint] = undefined;

            await validator.validate({ entries: true });

            expect(validator.warnings).toEqual([]);
            expect(validator.errors).toEqual([]);
          });
        }

        it('errors if field points to an invalid file', async () => {
          validator.package.packageJson[entryPoint] = './missing/file.js';

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
});
