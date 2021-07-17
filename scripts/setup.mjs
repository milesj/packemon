import execa from 'execa';
import glob from 'fast-glob';

const pkgs = await glob('./packages/*', { onlyDirectories: true });

// Running `beemo babel` as a package script through Yarn 2
// seems to hang on Windows, so let's run things manually here...
await Promise.all(
	pkgs.map((pkg) => execa('yarn', ['beemo', 'babel', `${pkg}/src`, '--out-dir', `${pkg}/lib`])),
);
