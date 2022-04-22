import { Plugin } from 'rollup';
import { Path } from '@boost/common';
import { InputMap } from '../../types';
import { ExtractedExports, extractExportsWithBabel } from './wrapper/babel';
// import { extractExportsWithSwc } from './wrapper/swc';

export interface AddMjsWrapperOptions {
	inputs: InputMap;
	packageRoot: Path;
	swc: boolean;
}

function createMjsFileFromExports(
	input: string,
	{ externalExports, namedExports, defaultExport }: ExtractedExports,
) {
	const mjs = [];

	// Support re-exports from externals (node modules)
	if (externalExports.length > 0) {
		externalExports.forEach((external) => {
			switch (external.type) {
				case 'export-all':
					mjs.push(`export * from '${external.source}';`);
					break;

				default:
					break;
			}
		});
	}

	// Nothing exported, so must have side-effects (bin files, for example)
	if (namedExports.length === 0 && !defaultExport) {
		mjs.unshift(`import './${input}.cjs';`, '');

		// Otherwise, define explicit named and default exports
	} else {
		mjs.unshift(`import data from './${input}.cjs';`, '');

		if (namedExports.length > 0) {
			mjs.push(`export const { ${namedExports.join(', ')} } = data;`);
		}

		if (defaultExport) {
			mjs.push(namedExports.length > 0 ? `export default data.default;` : `export default data;`);
		}
	}

	return [
		'// Bundled with Packemon: https://packemon.dev',
		'// This is an MJS wrapper for a sibling CJS file',
		'',
		...mjs,
	].join('\n');
}

export function addMjsWrapperForCjs({ inputs, packageRoot, swc }: AddMjsWrapperOptions): Plugin {
	return {
		name: 'packemon-add-mjs-wrapper-for-cjs',

		buildEnd(error) {
			if (error) {
				return;
			}

			// Rollup doesn't seem to use the SWC AST???
			const extractExports = extractExportsWithBabel; // swc ? extractExportsWithSwc : extractExportsWithBabel;

			Object.entries(inputs).forEach(([input, inputPath]) => {
				this.emitFile({
					type: 'asset',
					fileName: `${input}-wrapper.mjs`,
					source: createMjsFileFromExports(
						input,
						extractExports(packageRoot.append(inputPath).path(), this.getModuleInfo),
					),
				});
			});
		},
	};
}
