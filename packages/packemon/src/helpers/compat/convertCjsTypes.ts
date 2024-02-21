import glob from 'fast-glob';
import { Path } from '@boost/common';
import { FileSystem } from '../../FileSystem';

export async function convertCjsTypes(cjsDir: Path, fs: FileSystem) {
	const dtsFiles = await glob(['**/*.d.ts', '**/*.d.ts.map'], {
		absolute: true,
		cwd: cjsDir.path(),
	});

	await Promise.all(
		// eslint-disable-next-line @typescript-eslint/require-await
		dtsFiles.map(async (dtsFile) => {
			const dtsPath = Path.create(dtsFile);
			const inName = dtsPath.name();
			const outName = inName.replace('.d.ts', '.d.cts');

			// Read contents and fix source map paths
			let contents = fs.readFile(dtsPath.path()).replace(inName, outName);

			if (dtsFile.endsWith('.map')) {
				contents = contents.replace(inName.replace('.map', ''), outName.replace('.map', ''));
			}

			// Write the new file
			fs.writeFile(dtsPath.parent().append(outName).path(), contents);

			// Delete the old file
			if (fs.exists(dtsPath.path())) {
				fs.removeFile(dtsPath.path());
			}
		}),
	);
}
