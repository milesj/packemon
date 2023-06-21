import glob from 'fast-glob';
import fs from 'fs-extra';
import { Path } from '@boost/common';

export async function convertCjsTypes(cjsDir: Path) {
	const dtsFiles = await glob(['**/*.d.ts', '**/*.d.ts.map'], {
		absolute: true,
		cwd: cjsDir.path(),
	});

	await Promise.all(
		dtsFiles.map(async (dtsFile) => {
			const dtsPath = Path.create(dtsFile);
			const inName = dtsPath.name();
			const outName = inName.replace('.d.ts', '.d.cts');

			// Read contents and fix source map paths
			let contents = (await fs.readFile(dtsPath.path(), 'utf8')).replace(inName, outName);

			if (dtsFile.endsWith('.map')) {
				contents = contents.replace(inName.replace('.map', ''), outName.replace('.map', ''));
			}

			// Write the new file
			await fs.writeFile(dtsPath.parent().append(outName).path(), contents);

			// Delete the old file
			await fs.unlink(dtsPath.path());
		}),
	);
}
