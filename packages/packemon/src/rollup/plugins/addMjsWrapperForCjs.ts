import path from 'node:path';
import { GetModuleInfo, Plugin } from 'rollup';
import { Path } from '@boost/common';
import type { TSESTree } from '@typescript-eslint/types';
import { InputMap } from '../../types';

export interface AddMjsWrapperOptions {
	inputs: InputMap;
	packageRoot: Path;
}

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

function isExternalSource(source?: { value: string } | undefined): boolean {
	return !!source && !source.value.startsWith('.');
}

function extractName(node: TSESTree.Node): string[] | string {
	switch (node.type) {
		case 'Identifier':
			return node.name;

		case 'Literal':
			return String(node.value);

		// class Foo
		case 'ClassDeclaration':
			if (node.id) {
				return extractName(node.id);
			}
			break;

		// function foo
		case 'FunctionDeclaration':
			if (node.id) {
				return extractName(node.id);
			}
			break;

		// const foo = ...
		case 'VariableDeclaration':
			return node.declarations.flatMap((decl) => extractName(decl.id)).filter(Boolean);

		// const [foo, bar] = ...
		case 'ArrayPattern':
			return node.elements.flatMap((el) => (el ? extractName(el) : '')).filter(Boolean);

		// const { foo, bar } = ...
		case 'ObjectPattern':
			return node.properties
				.flatMap((prop) => (prop.type === 'Property' ? extractName(prop.value) : ''))
				.filter(Boolean);

		default:
			break;
	}

	return '';
}

function extractScopedIdentifiers(node: TSESTree.Program) {
	// id -> source
	const imports: Record<string, string> = {};
	// id
	const types: Set<string> = new Set();

	node.body.forEach((item) => {
		if (
			item.type === 'TSTypeAliasDeclaration' ||
			item.type === 'TSInterfaceDeclaration' ||
			item.type === 'TSEnumDeclaration'
		) {
			types.add(item.id.name);
		}

		if (item.type === 'ImportDeclaration') {
			item.specifiers.forEach((spec) => {
				const { name } = spec.local;

				imports[name] = item.source.value;

				if (item.importKind === 'type' || ('importKind' in spec && spec.importKind === 'type')) {
					types.add(name);
				}
			});
		}
	});

	return { imports, types };
}

export function extractExports(id: string, getModuleInfo: GetModuleInfo): ExtractedExports {
	const info = getModuleInfo(id);

	if (!info?.ast) {
		throw new Error(`Cannot get module info for ID: ${id}`);
	}

	const ast = info.ast as unknown as TSESTree.Program;
	const { imports, types } = extractScopedIdentifiers(ast);
	const externalExports: ExternalExport[] = [];
	const namedExports: string[] = [];
	let defaultExport = false;

	const mapNamed = (name: string[] | string | undefined) => {
		if (Array.isArray(name)) {
			name.forEach((n) => void mapNamed(n));
		} else if (name === 'default') {
			defaultExport = true;
		} else if (name && !types.has(name)) {
			namedExports.push(name);
		}
	};

	const filterType = (value: string) => !!value && !types.has(value);
	const namedExportsBySource: Record<string, string[]> = {};

	// eslint-disable-next-line complexity
	ast.body.forEach((item) => {
		if (item.type === 'ExportNamedDeclaration' && item.exportKind !== 'type') {
			// export class Foo {}
			// export function foo() {}
			// export const foo = {};
			if (item.declaration) {
				mapNamed(extractName(item.declaration));
			}

			if (item.specifiers.length > 0) {
				const names = item.specifiers
					.flatMap((spec) => extractName(spec.exported))
					.filter(filterType);

				// export { foo } from 'source';
				// export foo from 'source';
				// export * as foo from 'source';
				if (item.source) {
					if (isExternalSource(item.source)) {
						(namedExportsBySource[item.source.value] ??= []).push(...names);
					} else {
						mapNamed(names);
					}
				}

				// export { foo };
				if (!item.source) {
					names.forEach((name) => {
						const maybeSource = imports[name];

						if (maybeSource && isExternalSource({ value: maybeSource })) {
							(namedExportsBySource[maybeSource] ??= []).push(name);
						} else {
							mapNamed(name);
						}
					});
				}
			}
		}

		// export default ...
		if (item.type === 'ExportDefaultDeclaration') {
			defaultExport = !!item.declaration;
		}

		if (item.type === 'ExportAllDeclaration' && item.source) {
			// export * from 'node-module'
			// export * as ns from 'node-module'
			if (isExternalSource(item.source)) {
				externalExports.push({
					namespace: item.exported?.name,
					source: item.source.value,
					type: 'export-all',
				});

				// export * as ns from './relative/file'
			} else if (item.exported) {
				mapNamed(extractName(item.exported));

				// export * from './relative/file'
			} else if (item.source) {
				const importId = info.importedIds.find((file) =>
					file.startsWith(path.normalize(path.join(path.dirname(id), item.source.value))),
				);

				if (importId) {
					namedExports.push(...extractExports(importId, getModuleInfo).namedExports);
				}
			}
		}
	});

	Object.entries(namedExportsBySource).forEach(([source, names]) => {
		externalExports.push({
			names,
			source,
			type: 'export-named',
		});
	});

	return { externalExports, namedExports, defaultExport };
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
					mjs.push(
						`export *${external.namespace ? ` as ${external.namespace}` : ''} from '${
							external.source
						}';`,
					);
					break;

				case 'export-named':
					mjs.push(`export { ${external.names.join(', ')} } from '${external.source}';`);
					break;

				default:
					break;
			}
		});
	}

	namedExports.sort();

	// Nothing exported, so must have side-effects (bin files for example)
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
	]
		.join('\n')
		.trim();
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
						extractExports(packageRoot.append(inputPath).path(), this.getModuleInfo),
					),
				});
			});
		},
	};
}
