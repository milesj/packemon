import { getBabelInputConfig, getBabelOutputConfig } from '../../src/babel/config';
import { Format, Platform, Support } from '../../src/types';

jest.mock('../../src/babel/resolve', () => (name) => name);

const SUPPORTS: Support[] = ['legacy', 'stable', 'current', 'experimental'];

function renderPresetEnv(platform: Platform, format: Format, support: Support) {
  it(`handles preset-env: ${platform} + ${format} + ${support}`, () => {
    expect(getBabelOutputConfig({ format, platform, support }, {}).presets[0]).toMatchSnapshot();
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
      // @ts-expect-error
      getBabelOutputConfig({ format: 'lib', platform: 'unknown', support: 'stable' }, {}),
    ).toThrow('Unknown platform "unknown".');
  });

  it('transforms async/await to promises when `browser` or `native`', () => {
    expect(
      getBabelOutputConfig({ format: 'lib', platform: 'browser', support: 'stable' }, {}),
    ).toMatchSnapshot();

    expect(
      getBabelOutputConfig({ format: 'lib', platform: 'native', support: 'experimental' }, {}),
    ).toMatchSnapshot();
  });

  it('uses built-in destructuring and object spread when `current` or `experimental`', () => {
    expect(
      getBabelOutputConfig({ format: 'lib', platform: 'node', support: 'current' }, {}),
    ).toMatchSnapshot();

    expect(
      getBabelOutputConfig({ format: 'lib', platform: 'node', support: 'experimental' }, {}),
    ).toMatchSnapshot();
  });

  it('sets `parserOpts.strictMode` based on `strict` feature flag', () => {
    expect(
      getBabelOutputConfig(
        { format: 'lib', platform: 'node', support: 'stable' },
        { strict: true },
      ),
    ).toEqual(
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
      getBabelOutputConfig(
        { format: 'lib', platform: 'node', support: 'stable' },
        { workspaces: ['packages/*'] },
      ),
    ).toEqual(
      expect.objectContaining({
        babelrcRoots: ['packages/*'],
      }),
    );
  });
});
