import execa from 'execa';
import glob from 'fast-glob';

process.env.NODE_ENV = 'production';

async function build(pkg, noInterop) {
	return execa('yarn', ['beemo', 'babel', `${pkg}/src`, '--out-dir', `${pkg}/lib`], {
		env: {
			NO_INTEROP: noInterop ? 'true' : undefined,
		},
	});
}

// Running `beemo babel` as a package script through Yarn 2
// seems to hang on Windows, so let's run things manually here...
async function setup() {
	const pkgs = await glob('./packages/*', { onlyDirectories: true });

	// We need `babel-plugin-cjs-esm-interop` to build first since all other packages rely on it!
	const interopIndex = pkgs.findIndex((pkg) => pkg.includes('cjs-esm-interop'));

	await build(pkgs.slice(interopIndex, 1)[0], true);

	// We can build all the other packages in parallel now
	await Promise.all(pkgs.map((pkg) => build(pkg, false)));
}

setup().catch((error) => {
	console.error(error);
	process.exit(1);
});
