import paths from 'path';
import { NodePath, PluginObj, types as t } from '@babel/core';

function isEsmFile(file: string) {
	return /\.(ts|tsx|mjs)$/.test(file);
}

export default function cjsEsmBridge(): PluginObj {
	return {
		visitor: {
			CallExpression(path: NodePath<t.CallExpression>, state) {
				const isEsm = isEsmFile(state.filename);

				// `require()` not allowed in esm files
				// https://nodejs.org/api/esm.html#esm_no_require_exports_or_module_exports
				if (isEsm && path.get('callee').isIdentifier({ name: 'require' })) {
					throw new Error(
						`Found a \`require()\` call in non-module file "${paths.basename(
							state.filename,
						)}". Use dynamic \`import()\` instead.`,
					);
				}
			},

			MemberExpression(path: NodePath<t.MemberExpression>, state) {
				const isEsm = isEsmFile(state.filename);

				// `exports.name` not allowed in esm files
				// https://nodejs.org/api/esm.html#esm_no_require_exports_or_module_exports
				if (
					isEsm &&
					path.get('object').isIdentifier({ name: 'exports' }) &&
					path.get('property').isIdentifier()
				) {
					const { name } = path.node.property as t.Identifier;

					throw new Error(
						`Found an \`exports.${name} =\` expression in non-module file "${paths.basename(
							state.filename,
						)}". Use \`export const ${name} =\` instead.`,
					);
				}
			},
		},
	};
}
