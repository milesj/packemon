import { applyStyle } from '@boost/cli';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { Package, Project } from '../src';
import { TestArtifact } from './helpers';

describe('Artifact', () => {
  const root = new Path(getFixturePath('project'));
  let artifact: TestArtifact;

  beforeEach(() => {
    artifact = new TestArtifact(new Package(new Project(root), root, { name: 'pkg' } as any), []);
  });

  it('returns label when cast to string', () => {
    expect(String(artifact)).toBe('test');
  });

  describe('logWithSource()', () => {
    it('logs a message to level', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();

      artifact.log('Hello', 'info');

      expect(spy).toHaveBeenCalledWith('[pkg] Hello');

      spy.mockRestore();
    });

    it('includes output name and ID', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      artifact.log('Hello', 'error', { id: 'id', output: 'index' });

      expect(spy).toHaveBeenCalledWith(`[pkg:index] Hello${applyStyle(' (id=id)', 'muted')}`);

      spy.mockRestore();
    });

    it('includes source information', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      artifact.log('Hello', 'warn', {
        sourceFile: root.append('test.js').path(),
        sourceLine: 10,
        sourceColumn: 55,
      });

      expect(spy).toHaveBeenCalledWith(
        `[pkg] Hello${applyStyle(' (file=test.js line=10:55)', 'muted')}`,
      );

      spy.mockRestore();
    });

    it('includes source line without column', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      artifact.log('Hello', 'warn', {
        sourceLine: 10,
      });

      expect(spy).toHaveBeenCalledWith(`[pkg] Hello${applyStyle(' (line=10:?)', 'muted')}`);

      spy.mockRestore();
    });

    it('includes source column without line', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();

      artifact.log('Hello', 'info', {
        sourceColumn: 55,
      });

      expect(spy).toHaveBeenCalledWith(`[pkg] Hello${applyStyle(' (line=?:55)', 'muted')}`);

      spy.mockRestore();
    });
  });
});
