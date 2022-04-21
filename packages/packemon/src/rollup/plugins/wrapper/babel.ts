import path from 'path';
import { GetModuleInfo } from 'rollup';
import * as t from '@babel/types';

export interface ExtractedExports {
	namedExports: string[];
	defaultExport: boolean;
}

function extractName(node: t.Node): string[] | string | undefined {
	switch (node.type) {
		case 'Identifier':
			return node.name;

		// class Foo
		case 'ClassDeclaration':
			return extractName(node.id);

		// function foo
		case 'FunctionDeclaration':
			if (node.id) {
				return extractName(node.id);
			}
			break;

		// const foo = ...
		case 'VariableDeclaration':
			return node.declarations.map((decl) => extractName(decl.id)).filter(Boolean) as string[];

		// const [foo, bar] = ...
		case 'ArrayPattern':
			return node.elements.map((el) => (el ? extractName(el) : null)).filter(Boolean) as string[];

		// const { foo, bar } = ...
		case 'ObjectPattern':
			return node.properties
				.map((prop) =>
					// @ts-expect-error Is "Property" when logged
					prop.type === 'ObjectProperty' || prop.type === 'Property'
						? extractName(prop.value)
						: null,
				)
				.filter(Boolean) as string[];

		default:
			break;
	}

	return undefined;
}

function extractTypeNames(node: t.Program): string[] {
	const types: string[] = [];

	node.body.forEach((item) => {
		if (
			item.type === 'TSTypeAliasDeclaration' ||
			item.type === 'TSInterfaceDeclaration' ||
			item.type === 'TSEnumDeclaration'
		) {
			types.push(item.id.name);
		}

		if (item.type === 'ImportDeclaration') {
			item.specifiers.forEach((spec) => {
				if (item.importKind === 'type' || ('importKind' in spec && spec.importKind === 'type')) {
					types.push(spec.local.name);
				}
			});
		}
	});

	return types;
}

export function extractExports(id: string, getModuleInfo: GetModuleInfo): ExtractedExports {
	const info = getModuleInfo(id);

	if (!info || !info.ast) {
		throw new Error(`Cannot get module info for ID: ${id}`);
	}

	const importedFiles = info.importedIds;
	const typeNames = new Set(extractTypeNames(info.ast as t.Program));
	const namedExports: string[] = [];
	let defaultExport = false;

	const mapNamed = (name: string[] | string | undefined) => {
		if (Array.isArray(name)) {
			name.forEach((n) => void mapNamed(n));
		} else if (name === 'default') {
			defaultExport = true;
		} else if (name && !typeNames.has(name)) {
			namedExports.push(name);
		}
	};

	(info.ast as t.Program).body.forEach((item) => {
		if (item.type === 'ExportNamedDeclaration' && item.exportKind !== 'type') {
			// export function foo
			// export const foo
			if (item.declaration) {
				mapNamed(extractName(item.declaration));
			}

			// export { foo }
			// export foo
			// export * as foo
			if (item.specifiers.length > 0) {
				mapNamed(
					item.specifiers.map((spec) => extractName(spec.exported)).filter(Boolean) as string[],
				);
			}
		}

		// export default ...
		if (item.type === 'ExportDefaultDeclaration') {
			defaultExport = !!item.declaration;
		}

		if (item.type === 'ExportAllDeclaration' && item.source) {
			// @ts-expect-error Not typed in Babel, is part of ESTree compliance
			const exported = item.exported as t.Identifier | null;

			// export * as name from ...
			if (exported) {
				mapNamed(extractName(exported));

				// export * from ...
			} else {
				const importId = importedFiles.find((file) =>
					file.startsWith(path.normalize(path.join(path.dirname(id), item.source.value))),
				);

				if (importId) {
					namedExports.push(...extractExports(importId, getModuleInfo).namedExports);
				}
			}
		}
	});

	return { namedExports, defaultExport };
}
