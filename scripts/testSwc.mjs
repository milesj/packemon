import fs from 'fs';
import { transformSync, transformFileSync } from '@swc/core';

const filename = './packages/packemon/src/babel/config.ts';

try {
	fs.mkdirSync(new URL('./swc', import.meta.url));
} catch {}

const input = transformFileSync(filename, {
	jsc: {
		parser: { syntax: 'typescript', tsx: true, decorators: true },
		transform: {
			optimizer: {
				globals: {
					vars: {
						__DEV__: "process.env.NODE_ENV !== 'production'",
						__PROD__: "process.env.NODE_ENV === 'production'",
						__TEST__: "process.env.NODE_ENV === 'test'",
					},
				},
			},
			legacyDecorator: true,
			decoratorMetadata: false,
			react: {
				development: false,
				runtime: 'automatic',
				throwIfNamespace: true,
			},
		},
		externalHelpers: false,
		loose: false,
		keepClassNames: true,
		target: 'es2022',
	},
	caller: { name: 'packemon' },
	configFile: false,
	swcrc: false,
	exclude: [
		'node_modules',
		'tests',
		'__fixtures__',
		'__mocks__',
		'__tests__',
		'\\.(config|test|spec)\\.[a-z]+$',
		'\\.(test|spec)\\.[a-z]+$',
	],
	sourceMaps: true,
	filename,
});

fs.writeFileSync(new URL('./swc/input-pass.js', import.meta.url), input.code, 'utf8');

function getOutputConfig(type) {
	return {
		env: {
			loose: false,
			mode: undefined,
			bugfixes: true,
			shippedProposals: true,
			targets: {
				node: '12.17.0',
			},
		},
		module: {
			type,
			ignoreDynamic: true,
		},
		jsc: {
			parser: {
				syntax: 'ecmascript',
			},
			transform: {
				optimizer: undefined,
			},
			target: 'es5',
			keepClassNames: true,
			preserveAllComments: false,
		},
		caller: { name: 'packemon' },
		configFile: false,
		swcrc: false,
		exclude: [],
		sourceMaps: true,
		filename,
	};
}

fs.writeFileSync(
	new URL('./swc/output-cjs.js', import.meta.url),
	transformSync(input.code, getOutputConfig('commonjs')).code,
	'utf8',
);

fs.writeFileSync(
	new URL('./swc/output-esm.js', import.meta.url),
	transformSync(input.code, getOutputConfig('es6')).code,
	'utf8',
);

fs.writeFileSync(
	new URL('./swc/output-umd.js', import.meta.url),
	transformSync(input.code, getOutputConfig('umd')).code,
	'utf8',
);
