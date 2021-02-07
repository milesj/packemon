import { loadModule } from '../../src/helpers/loadModule';

describe('loadModule()', () => {
  it('doesnt error if module exists', () => {
    expect(() => loadModule('typescript', '')).not.toThrow();
  });

  it('errors if module does not exist', () => {
    expect(() => loadModule('unknown-module', 'Fake module!')).toThrow(
      'Fake module! Please install with `yarn add --dev unknown-module`.',
    );
  });
});
