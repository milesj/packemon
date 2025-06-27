import { execa } from 'execa';
import path from 'path';
import os from 'os';

const CWD = process.cwd();
const TEMP_DIR = os.tmpdir();

async function build(dir) {
	await execa(
		'npx',
		[
			'--yes',
			'--package',
			'packemon',
			'--package',
			'typescript',
			'--',
			'packemon',
			'build',
			'--cwd',
			path.join(CWD, dir),
		],
		{
			cwd: TEMP_DIR,
			preferLocal: true,
			stdio: 'inherit',
		},
	);
}

await build('packages/babel-plugin-cjs-esm-interop');
await build('packages/babel-plugin-conditional-invariant');
await build('packages/babel-plugin-env-constants');
await build('packages/packemon');

// We need to link the new binaries to node_modules/.bin
await execa('yarn', ['install']);
