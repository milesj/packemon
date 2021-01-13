import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import Project from '../src/Project';
import Package from '../src/Package';
import PackageValidator from '../src/PackageValidator';

describe('PackageValidator', () => {
  let validator: PackageValidator;
  let pathSpy: jest.SpyInstance;
  let urlSpy: jest.SpyInstance;
  let binSpy: jest.SpyInstance;

  beforeEach(() => {
    const root = new Path(getFixturePath('project'));

    validator = new PackageValidator(
      new Package(new Project(root), root, {
        name: 'test',
        version: '0.0.0',
        description: 'Test',
        keywords: ['test'],
        packemon: {},
      }),
    );

    // @ts-expect-error Private
    pathSpy = jest.spyOn(validator, 'doesPathExist').mockImplementation(() => true);

    // @ts-expect-error Private
    urlSpy = jest.spyOn(validator, 'doesUrlExist').mockImplementation(() => true);

    // @ts-expect-error Private
    binSpy = jest.spyOn(validator, 'getBinVersion').mockImplementation();
  });

  describe('checkEngines()', () => {
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
        binSpy.mockImplementation(() => '9.1.2');

        await validator.validate({ engines: true });

        expect(validator.warnings).toEqual([
          'Node.js does not satisfy engine constraints. Found 9.1.2, requires >=10.10.0.',
        ]);
        expect(validator.errors).toEqual([]);
      });

      it('doesnt warn if node version satisfies constraint', async () => {
        binSpy.mockImplementation(() => 'v12.1.2');

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
        binSpy.mockImplementation(() => 'v8.0.0');

        await validator.validate({ engines: true });

        expect(validator.warnings).toEqual([
          'NPM does not satisfy engine constraints. Found 8.0.0, requires ^7.0.0.',
        ]);
        expect(validator.errors).toEqual([]);
      });

      it('doesnt warn if npm version satisfies constraint', async () => {
        binSpy.mockImplementation(() => '7.7.7');

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
        binSpy.mockImplementation(() => '0.1.9');

        await validator.validate({ engines: true });

        expect(validator.warnings).toEqual([
          'Yarn does not satisfy engine constraints. Found 0.1.9, requires ^1.0.0 || ^2.0.0.',
        ]);
        expect(validator.errors).toEqual([]);
      });

      it('doesnt warn if yarn version satisfies constraint', async () => {
        binSpy.mockImplementation(() => 'v1.4.6');

        await validator.validate({ engines: true });

        expect(validator.warnings).toEqual([]);
        expect(validator.errors).toEqual([]);
      });
    });
  });
});
