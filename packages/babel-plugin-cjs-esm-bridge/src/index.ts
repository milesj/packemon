import paths from 'path';
import { NodePath, PluginObj, types as t } from '@babel/core';

function isEsmFile(file: string) {
	return /\.(ts|tsx|mjs)$/.test(file);
}

export default function cjsEsmBridge(): PluginObj {
	return {
		visitor: {
			CallExpression: {
				enter(path: NodePath<t.CallExpression>, state) {
					const isEsm = isEsmFile(state.filename);

					// require() not allowed in esm files
					// https://nodejs.org/api/esm.html#esm_no_require_exports_or_module_exports
					if (isEsm && path.get('callee').isIdentifier({ name: 'require' })) {
						throw new Error(
							`Found a \`require()\` call in "${paths.basename(
								state.filename,
							)}", this is not allowed in ".mjs" files. Use dynamic \`import()\` instead.`,
						);
					}
				},
			},
		},
	};
}
