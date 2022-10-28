import execa from 'execa';

async function build(cwd, format = 'lib') {
	await execa('babel', ['src/', '--out-dir', format], { cwd, preferLocal: true });
}

await build('packages/babel-plugin-cjs-esm-interop');
await build('packages/babel-plugin-conditional-variant');
await build('packages/babel-plugin-env-constants');
await build('packages/packemon', 'cjs');
