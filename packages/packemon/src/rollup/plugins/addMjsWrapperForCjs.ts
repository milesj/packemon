import { Plugin } from 'rollup';
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
				.map((prop) => (prop.type === 'ObjectProperty' ? extractNameFromNode(prop.key) : null))
				.filter(Boolean) as string[];

		default:
			break;
	}

	return undefined;
}

function extractExportsFromAst(ast: t.Program): ExtractedExports {
	const namedExports: string[] = [];
	let defaultExport = '';

	const mapNamed = (name: string[] | string | undefined) => {
		if (Array.isArray(name)) {
			namedExports.push(...name);
		} else if (name) {
			namedExports.push(name);
		}
	};

	ast.body.forEach((item) => {
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
	});

	return { namedExports, defaultExport };
}

export function addMjsWrapperForCjs({ inputs, packageRoot }: AddMjsWrapperOptions): Plugin {
	const inputsByPath = Object.fromEntries(
		Object.entries(inputs).map(([input, path]) => [packageRoot.append(path).path(), input]),
	);

	return {
		name: 'packemon-add-mjs-wrapper-for-cjs',

		buildEnd(error) {
			if (error) {
				return;
			}

			Object.keys(inputsByPath).forEach((id) => {
				const info = this.getModuleInfo(id);

				console.log();
				console.log(id);

				if (!info || !info.ast) {
					throw new Error(`Cannot get module info for ID: ${id}`);
				}

				const exports = extractExportsFromAst(info.ast as t.Program);

				console.log(exports);
				// console.log(info);
				// console.log('dynamicallyImportedIdResolutions', info.dynamicallyImportedIdResolutions);
				// console.log('dynamicallyImportedIds', info.dynamicallyImportedIds);
				// console.log('dynamicImporters', info.dynamicImporters);
				// console.log('hasDefaultExport', info.hasDefaultExport);
				// console.log('implicitlyLoadedAfterOneOf', info.implicitlyLoadedAfterOneOf);
				// console.log('implicitlyLoadedBefore', info.implicitlyLoadedBefore);
				// console.log('importedIdResolutions', info.importedIdResolutions);
				// console.log('importedIds', info.importedIds);
				// console.log('importers', info.importers);
			});
		},
	};
}
