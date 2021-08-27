import paths from 'path';
import { NodePath, PluginObj, types as t } from '@babel/core';

function isEsmFile(file: string) {
	return /\.(ts|tsx|mjs)$/.test(file);
}

export interface CjsEsmBridgeOptions {
	// The output format
	format?: 'cjs' | 'mjs';
}

export default function cjsEsmBridge({ format = 'mjs' }: CjsEsmBridgeOptions = {}): PluginObj {
	return {
		visitor: {
			CallExpression(path: NodePath<t.CallExpression>, state) {
				// `require()` not allowed in esm files
				// https://nodejs.org/api/esm.html#esm_no_require_exports_or_module_exports
				if (format === 'mjs' && path.get('callee').isIdentifier({ name: 'require' })) {
					throw new Error(
						`Found a \`require()\` call in non-module file "${paths.basename(
							state.filename,
						)}". Use dynamic \`import()\` instead.`,
					);
				}
			},

			Identifier(path: NodePath<t.Identifier>, state) {
				// __filename -> import.meta.url
				// https://nodejs.org/api/esm.html#esm_no_filename_or_dirname
				if (format === 'mjs' && path.isIdentifier({ name: '__filename' })) {
					path.replaceWith(
						t.memberExpression(
							t.metaProperty(t.identifier('import'), t.identifier('meta')),
							t.identifier('url'),
						),
					);
				}
			},

			MemberExpression(path: NodePath<t.MemberExpression>, state) {
				const isEsm = isEsmFile(state.filename);
				const file = paths.basename(state.filename);

				// `exports.<name>` not allowed in esm files
				// https://nodejs.org/api/esm.html#esm_no_require_exports_or_module_exports
				if (
					isEsm &&
					path.get('object').isIdentifier({ name: 'exports' }) &&
					path.get('property').isIdentifier()
				) {
					const { name } = path.node.property as t.Identifier;

					throw new Error(
						`Found an \`exports.${name} =\` expression in non-module file "${file}". Use \`export const ${name} =\` instead.`,
					);
				}

				// `module.exports` not allowed in esm files
				// https://nodejs.org/api/esm.html#esm_no_require_exports_or_module_exports
				if (
					isEsm &&
					path.get('object').isIdentifier({ name: 'module' }) &&
					path.get('property').isIdentifier({ name: 'exports' })
				) {
					throw new Error(
						`Found a \`module.exports =\` expression in non-module file "${file}". Use \`export default\` instead.`,
					);
				}

				// import.meta.url -> __filename
				// https://nodejs.org/api/esm.html#esm_no_filename_or_dirname
				if (
					format === 'cjs' &&
					path.get('object').isMetaProperty() &&
					(path.get('object.meta') as NodePath).isIdentifier({ name: 'import' }) &&
					(path.get('object.property') as NodePath).isIdentifier({ name: 'meta' }) &&
					path.get('property').isIdentifier({ name: 'url' })
				) {
					path.replaceWith(t.identifier('__filename'));
				}
			},
		},
	};
}
