import { execa } from 'execa';
import path from 'path';

async function build(cwd) {
	await execa(
		'yarn',
		['dlx', '--package', 'packemon', '--package', 'typescript', '--quiet', 'packemon', 'build'],
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
await build('packages/packemon', true);

// We need to link the new binaries to node_modules/.bin
await execa('yarn', ['install']);
