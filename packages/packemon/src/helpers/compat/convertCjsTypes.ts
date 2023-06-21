import glob from 'fast-glob';
import fs from 'fs-extra';
import { Path } from '@boost/common';

async function renameDtsFiles(cjsDir: Path) {
	const dtsFiles = await glob('**/*.d.ts', {
		absolute: true,
		cwd: cjsDir.path(),
	});

	await Promise.all(
		dtsFiles.map(async (dtsFile) => {
			const dtsPath = Path.create(dtsFile);
			const dtsName = dtsPath.name();
			const dctsName = dtsName.replace('.d.ts', '.d.cts');

			// Read contents and fix source map paths
			const contents = (await fs.readFile(dtsPath.path(), 'utf8')).replace(dtsName, dctsName);

			// Write the new file
			await fs.writeFile(dtsPath.parent().append(dctsName).path(), contents);

			// Delete the old file
			await fs.unlink(dtsPath.path());
		}),
	);
}

export async function convertCjsTypes(cjsDir: Path) {
	await renameDtsFiles(cjsDir);
}
