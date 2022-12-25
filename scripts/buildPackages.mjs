import execa from 'execa';
import path from 'path';
import fs from 'fs';

async function build(cwd) {
	await execa(
		'swc',
		[
			'src',
			'--out-dir',
			'lib',
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
await build('packages/packemon');

// Packemon uses .cjs files but swc compiles to .js, so create a link!
const cjsDir = path.join(process.cwd(), 'packages/packemon/cjs');

if (!fs.existsSync(cjsDir)) {
	await fs.promises.mkdir(cjsDir);
}

await fs.promises.writeFile(path.join(cjsDir, 'bin.cjs'), `require('../lib/bin.js');`);

// We need to link the new binaries to node_modules/.bin
await execa('yarn', ['install']);
