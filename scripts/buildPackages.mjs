import execa from 'execa';
import path from 'path';
import fs from 'fs';

async function build(cwd, format = 'lib') {
	await execa(
		'swc',
		[
			'src',
			'--out-dir',
			format,
			'--delete-dir-on-start',
			'--extensions',
			'.ts,.tsx',
			'--config-file',
			path.join(process.cwd(), 'scripts/.swcrc'),
		],
		{
			cwd: path.join(process.cwd(), cwd),
			preferLocal: true,
			stdio: 'inherit',
		},
	);
}

await build('packages/babel-plugin-cjs-esm-interop');
await build('packages/babel-plugin-conditional-invariant');
await build('packages/babel-plugin-env-constants');
await build('packages/packemon', 'cjs');

// Packemon uses .cjs files but swc compiles to .js, so create some fake ones!
await fs.promises.writeFile(
	path.join(process.cwd(), 'packages/packemon/cjs/bin.cjs'),
	`require('./bin.js');`,
);
