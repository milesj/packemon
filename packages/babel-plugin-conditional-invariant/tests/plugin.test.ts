import { describe, expect, it } from 'vitest';
import { transformAsync, TransformOptions } from '@babel/core';
import conditionalInvariantPlugin from '../src';

async function transform(code: string, options?: TransformOptions): Promise<string> {
	const result = await transformAsync(code, {
		babelrc: false,
		comments: false,
		configFile: false,
		filename: 'file.js',
		plugins: [conditionalInvariantPlugin()],
		presets: ['@babel/preset-react'],
		generatorOpts: {
			jsescOption: { quotes: 'single' },
		},
		...options,
	});

	return result?.code ?? '';
}

describe('conditionalInvariantPlugin()', () => {
	it(`will transform valid expressions`, async () => {
		await expect(
			transform(`
invariant();

invariant(false);

while (true) {
	invariant(true);
}

do {
	invariant(value === false, 'Some message');
} while (true);

switch (value) {
	case 1:
		invariant(value === true, 'Some message');
		break;

	case 2: {
		invariant(value === true, 'Some message');
		break;
	}
}

if (1) {
	invariant(!value, 'Some message', 'another arg');
} else if (2) {
	invariant(!value, 'Some message', 123);
} else {
	invariant(!!value, 'Some message', true, 456);
}
`),
		).resolves.toMatchSnapshot();
	});

	it(`will transform if wrapped in a non-matching conditional`, async () => {
		await expect(
			transform(`
if (process.env.NODE_ENV === 'development') {
	invariant();
}
`),
		).resolves.toMatchSnapshot();
	});

	it(`will transform if wrapped in a non-matching conditional that is layers deep`, async () => {
		await expect(
			transform(`
if (process.env.NODE_ENV === 'development') {
	if (true) {
		if (false) {
			invariant();
		}
	}
}
`),
		).resolves.toMatchSnapshot();
	});

	it(`will not transform if wrapped in a matching conditional`, async () => {
		await expect(
			transform(`
if (process.env.NODE_ENV !== 'production') {
	invariant();
}
`),
		).resolves.toMatchSnapshot();
	});

	it(`will not transform if wrapped in a matching conditional that is layers deep`, async () => {
		await expect(
			transform(`
if (process.env.NODE_ENV !== 'production') {
	if (true) {
		if (false) {
			invariant();
		}
	}
}
`),
		).resolves.toMatchSnapshot();
	});
});
