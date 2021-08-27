import execa from 'execa';
import glob from 'fast-glob';

// Running `beemo babel` as a package script through Yarn 2
// seems to hang on Windows, so let's run things manually here...
async function setup() {
	const pkgs = await glob('./packages/*', { onlyDirectories: true });

	// We need `babel-plugin-cjs-esm-interop` to build first since all
	// other packages rely on it!
	pkgs.sort();

	await Promise.all(
		pkgs.map((pkg) =>
			execa('yarn', ['beemo', 'babel', `${pkg}/src`, '--out-dir', `${pkg}/lib`], {
				env: {
					NO_INTEROP: pkg.includes('cjs-esm-interop') ? 'true' : undefined,
				},
			}),
		),
	);
}

setup();
