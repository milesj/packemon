import fs from 'fs';
import { transformSync, transformFileSync } from '@swc/core';

const input = transformFileSync('./packages/packemon/src/commands/Scaffold.tsx', {
	jsc: {
		parser: { syntax: 'typescript', tsx: true, decorators: true },
		transform: {
			optimizer: undefined,
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
});

fs.writeFileSync(new URL('./swc/input-pass.js', import.meta.url), input.code, 'utf8');

const output = transformSync(input.code, {
	env: {
		loose: false,
		mode: undefined,
		shippedProposals: true,
		targets: {
			node: '10.17.0',
		},
	},
	module: {
		type: 'commonjs',
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
});

fs.writeFileSync(new URL('./swc/output-pass.js', import.meta.url), output.code, 'utf8');
