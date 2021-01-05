import { transformAsync, TransformOptions } from '@babel/core';
import envExpressions from '../../../src/babel/plugins/envExpressions';

async function transform(code: string, options?: TransformOptions): Promise<string> {
  const result = await transformAsync(code, {
    babelrc: false,
    comments: false,
    configFile: false,
    filename: 'file.js',
    plugins: [envExpressions()],
    presets: ['@babel/preset-react'],
    generatorOpts: {
      quotes: 'single',
    },
    ...options,
  });

  return result?.code || '';
}

describe('envExpressions()', () => {
  ['DEV', 'PROD', 'TEST'].forEach((name) => {
    const expr = `__${name}__`;

    it(`transforms ${expr} expressions`, async () => {
      expect(
        await transform(`
if (${expr}) {
} else if (${expr} && 123) {
} else if (true || ${expr}) {
} else if (!${expr}) {
} else {}

switch (${expr}) {}

while (${expr}) {}

do {} while (${expr});

const ternary = ${expr} ? true : false;

const objectValue = {
  foo: ${expr},
};

const arrayValue = [${expr}];

<Foo>{${expr} ? 'Child' : null}</Foo>;`),
      ).toMatchSnapshot();
    });

    it(`will not transform invalid ${expr} expressions`, async () => {
      expect(
        await transform(`
const ${expr} = 123;

const objectProperty = { ${expr}: true };

const objectComputed = { [${expr}]: false };

objectProperty.${expr} = false;
objectComputed[${expr}] = false;

const arrayIndex = [];
arrayIndex[${expr}] = 1;`),
      ).toMatchSnapshot();
    });
  });
});