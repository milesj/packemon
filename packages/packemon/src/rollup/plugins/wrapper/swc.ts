/* eslint-disable no-nested-ternary */

import path from 'path';
import { GetModuleInfo } from 'rollup';
import {
	ArrayPattern,
	ClassDeclaration,
	FunctionDeclaration,
	Identifier,
	Module,
	Node,
	ObjectPattern,
	VariableDeclaration,
} from '@swc/core';
import { ExtractedExports } from './babel';

function extractName(node: Node): string[] | string | undefined {
	switch (node.type) {
		case 'Identifier':
			return (node as Identifier).value;

		// class Foo
		case 'ClassDeclaration':
			return extractName((node as ClassDeclaration).identifier);

		// function foo
		case 'FunctionDeclaration':
			return extractName((node as FunctionDeclaration).identifier);

		// const foo = ...
		case 'VariableDeclaration':
			return (node as VariableDeclaration).declarations
				.map((decl) => extractName(decl.id))
				.filter(Boolean) as string[];

		// const [foo, bar] = ...
		case 'ArrayPattern':
			return (node as ArrayPattern).elements
				.map((el) => (el ? extractName(el) : null))
				.filter(Boolean) as string[];

		// const { foo, bar } = ...
		case 'ObjectPattern':
			return (node as ObjectPattern).properties
				.map((prop) =>
					prop.type === 'KeyValuePatternProperty' ? extractName(prop.value || prop.key) : null,
				)
				.filter(Boolean) as string[];

		default:
			break;
	}

	return undefined;
}

function extractTypeNames(node: Module): string[] {
	const types: string[] = [];

	node.body.forEach((item) => {
		if (
			item.type === 'TsTypeAliasDeclaration' ||
			item.type === 'TsInterfaceDeclaration' ||
			item.type === 'TsEnumDeclaration'
		) {
			types.push(item.id.value);
		}

		if (item.type === 'ImportDeclaration') {
			item.specifiers.forEach((spec) => {
				if (item.typeOnly || ('isTypeOnly' in spec && spec.isTypeOnly)) {
					types.push(spec.local.value);
				}
			});
		}
	});

	return types;
}

export function extractExportsWithSwc(id: string, getModuleInfo: GetModuleInfo): ExtractedExports {
	const info = getModuleInfo(id);

	if (!info || !info.ast) {
		throw new Error(`Cannot get module info for ID: ${id}`);
	}

	const importedFiles = info.importedIds;
	const typeNames = new Set(extractTypeNames(info.ast as unknown as Module));
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

	console.log(id, info);

	(info.ast as unknown as Module).body.forEach((item) => {
		// export { foo }
		// export foo
		// export * as foo
		if (item.type === 'ExportNamedDeclaration' && !item.typeOnly && item.specifiers.length > 0) {
			mapNamed(
				item.specifiers
					.map((spec) =>
						extractName(
							spec.type === 'ExportNamespaceSpecifier'
								? spec.name
								: spec.type === 'ExportDefaultSpecifier'
								? spec.exported
								: spec.exported ?? spec.orig,
						),
					)
					.filter(Boolean) as string[],
			);
		}

		// export function foo
		// export const foo
		if (item.type === 'ExportDeclaration' && item.declaration) {
			mapNamed(extractName(item.declaration));
		}

		// export default ...
		if (item.type === 'ExportDefaultDeclaration') {
			defaultExport = !!item.decl;
		}

		// export * from ...
		if (item.type === 'ExportAllDeclaration' && item.source) {
			const importId = importedFiles.find((file) =>
				file.startsWith(path.normalize(path.join(path.dirname(id), item.source.value))),
			);

			if (importId) {
				namedExports.push(...extractExportsWithSwc(importId, getModuleInfo).namedExports);
			}
		}
	});

	return { namedExports, defaultExport };
}
