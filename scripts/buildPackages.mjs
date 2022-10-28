import execa from 'execa';
import path from 'path';

async function build(cwd, format = 'lib') {
	await execa(
		'babel',
		[
			'src',
			'--out-dir',
			format,
			'--extensions',
			'.ts,.tsx',
			'--out-file-extension',
			format === 'lib' ? '.js' : '.cjs',
			// We can't use the root `babel.config.js` as the moon preset
			// uses packages from this repo, so it never resolves.
			'--config-file',
			path.join(process.cwd(), 'scripts/babel.config.js'),
		],
		{
			cwd: path.join(process.cwd(), cwd),
			// env: { DEBUG: 'babel:*', NO_INTEROP: 'true' },
			preferLocal: true,
			stdio: 'inherit',
		},
	);
}

await build('packages/babel-plugin-cjs-esm-interop');
await build('packages/babel-plugin-conditional-invariant');
await build('packages/babel-plugin-env-constants');
await build('packages/packemon', 'cjs');
