import execa from 'execa';
import glob from 'fast-glob';

// Running `beemo babel` as a package script through Yarn 2
// seems to hang on Windows, so let's run things manually here...
function setup() {
	const pkgs = await glob('./packages/*', { onlyDirectories: true });

	await Promise.all(
		pkgs.map((pkg) => execa('yarn', ['beemo', 'babel', `${pkg}/src`, '--out-dir', `${pkg}/lib`])),
	);
}

setup();
