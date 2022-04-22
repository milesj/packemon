import path from 'path';
import { GetModuleInfo } from 'rollup';
import * as t from '@babel/types';

export type ExternalExport =
	| {
			type: 'export-all';
			namespace?: string;
			source: string;
	  }
	| {
			type: 'export-named';
			names: string[];
			source: string;
	  };

export interface ExtractedExports {
	externalExports: ExternalExport[];
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

export function extractExportsWithBabel(
	id: string,
	getModuleInfo: GetModuleInfo,
): ExtractedExports {
	const info = getModuleInfo(id);

	if (!info || !info.ast) {
		throw new Error(`Cannot get module info for ID: ${id}`);
	}

	const importedFiles = info.importedIds;
	const typeNames = new Set(extractTypeNames(info.ast as t.Program));
	const externalExports: ExternalExport[] = [];
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

	// eslint-disable-next-line complexity
	(info.ast as t.Program).body.forEach((item) => {
		if (item.type === 'ExportNamedDeclaration' && item.exportKind !== 'type') {
			const isExternal = item.source && !item.source.value.startsWith('.');

			// export function foo
			// export const foo
			if (item.declaration) {
				mapNamed(extractName(item.declaration));
			}

			// export { foo }
			// export foo
			// export * as foo
			if (item.specifiers.length > 0) {
				const names = item.specifiers
					.map((spec) => extractName(spec.exported))
					.filter(Boolean) as string[];

				if (isExternal) {
					externalExports.push({
						names,
						source: item.source!.value,
						type: 'export-named',
					});
				} else {
					mapNamed(names);
				}
			}
		}

		// export default ...
		if (item.type === 'ExportDefaultDeclaration') {
			defaultExport = !!item.declaration;
		}

		if (item.type === 'ExportAllDeclaration' && item.source) {
			const isExternal = !item.source.value.startsWith('.');
			// @ts-expect-error Not typed in Babel, is part of ESTree compliance
			const exported = item.exported as t.Identifier | null;

			// export * from 'node-module'
			// export * as ns from 'node-module'
			if (isExternal) {
				externalExports.push({
					namespace: exported ? exported.name : undefined,
					source: item.source.value,
					type: 'export-all',
				});

				// export * as ns from './relative/file'
			} else if (exported) {
				mapNamed(extractName(exported));

				// export * from './relative/file'
			} else {
				const importId = importedFiles.find((file) =>
					file.startsWith(path.normalize(path.join(path.dirname(id), item.source.value))),
				);

				if (importId) {
					namedExports.push(...extractExportsWithBabel(importId, getModuleInfo).namedExports);
				}
			}
		}
	});

	return { externalExports, namedExports, defaultExport };
}
