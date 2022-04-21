import path from 'path';
import { GetModuleInfo, Plugin } from 'rollup';
import * as t from '@babel/types';
import { Path } from '@boost/common';
import { InputMap } from '../../types';

export interface AddMjsWrapperOptions {
	inputs: InputMap;
	packageRoot: Path;
}

export interface ExtractedExports {
	namedExports: string[];
	defaultExport?: string;
}

function extractNameFromNode(node: t.Node): string[] | string | undefined {
	switch (node.type) {
		case 'Identifier':
			return node.name;

		// class Foo
		case 'ClassDeclaration':
			return extractNameFromNode(node.id);

		// function foo
		case 'FunctionDeclaration':
			if (node.id) {
				return extractNameFromNode(node.id);
			}
			break;

		// const foo = ...
		case 'VariableDeclaration':
			if (node.declarations.length > 0) {
				return extractNameFromNode(node.declarations[0].id);
			}
			break;

		// const [foo, bar] = ...
		case 'ArrayPattern':
			return node.elements
				.map((el) => (el ? extractNameFromNode(el) : null))
				.filter(Boolean) as string[];

		// const { foo, bar } = ...
		case 'ObjectPattern':
			return node.properties
				.map((prop) =>
					// @ts-expect-error Is "Property" when logged
					prop.type === 'ObjectProperty' || prop.type === 'Property'
						? extractNameFromNode(prop.value)
						: null,
				)
				.filter(Boolean) as string[];

		default:
			break;
	}

	return undefined;
}

function extractExportsFromAst(id: string, getModuleInfo: GetModuleInfo): ExtractedExports {
	const info = getModuleInfo(id);

	if (!info || !info.ast) {
		throw new Error(`Cannot get module info for ID: ${id}`);
	}

	const importedFiles = info.importedIds;
	const namedExports: string[] = [];
	let defaultExport = '';

	const mapNamed = (name: string[] | string | undefined) => {
		if (Array.isArray(name)) {
			namedExports.push(...name);
		} else if (name) {
			namedExports.push(name);
		}
	};

	(info.ast as t.Program).body.forEach((item) => {
		if (item.type === 'ExportNamedDeclaration' && item.exportKind !== 'type') {
			// export function foo
			// export const foo
			if (item.declaration) {
				mapNamed(extractNameFromNode(item.declaration));
			}

			// export { foo }
			// export foo
			// export * as foo
			if (item.specifiers.length > 0) {
				mapNamed(
					item.specifiers
						.map((spec) => extractNameFromNode(spec.exported))
						.filter(Boolean) as string[],
				);
			}
		}

		// export default ...
		if (item.type === 'ExportDefaultDeclaration' && item.declaration) {
			defaultExport = String(extractNameFromNode(item.declaration));
		}

		// export * from ...
		if (item.type === 'ExportAllDeclaration' && item.source) {
			const importId = importedFiles.find((file) =>
				file.startsWith(path.normalize(path.join(path.dirname(id), item.source.value))),
			);

			if (importId) {
				namedExports.push(...extractExportsFromAst(importId, getModuleInfo).namedExports);
			}
		}
	});

	return { namedExports, defaultExport };
}

function createMjsFileFromExports(
	input: string,
	{ namedExports, defaultExport }: ExtractedExports,
) {
	// Nothing exported, so must have side-effects (bin files, for example)
	if (namedExports.length === 0 && !defaultExport) {
		return `import './${input}.cjs';`;
	}

	const mjs = [
		'// Bundled with Packemon: https://packemon.dev',
		'// This is an MJS wrapper for a sibling CJS file',
	];

	mjs.push('', `import data from './${input}.cjs';`);

	if (namedExports.length > 0) {
		mjs.push('', `export const { ${namedExports.join(', ')} } = data;`);
	}

	if (defaultExport) {
		mjs.push('', namedExports.length > 0 ? `export default data.default;` : `export default data;`);
	}

	return mjs.join('\n');
}

export function addMjsWrapperForCjs({ inputs, packageRoot }: AddMjsWrapperOptions): Plugin {
	return {
		name: 'packemon-add-mjs-wrapper-for-cjs',

		buildEnd(error) {
			if (error) {
				return;
			}

			Object.entries(inputs).forEach(([input, inputPath]) => {
				this.emitFile({
					type: 'asset',
					fileName: `${input}-wrapper.mjs`,
					source: createMjsFileFromExports(
						input,
						extractExportsFromAst(packageRoot.append(inputPath).path(), this.getModuleInfo),
					),
				});
			});
		},
	};
}
