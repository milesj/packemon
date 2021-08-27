import paths from 'path';
import { NodePath, PluginObj, types as t } from '@babel/core';
// @ts-expect-error Not typed
import { addDefault } from '@babel/helper-module-imports';

function isEsmFile(file: string) {
	return /\.(ts|tsx|mjs)$/.test(file);
}

function isPathDirname(path: NodePath): boolean {
	// dirname(foo)
	if (path.isCallExpression() && path.get('callee').isIdentifier({ name: 'dirname' })) {
		return true;
	}

	// path.dirname(foo)
	return Boolean(
		path.isCallExpression() &&
			path.get('callee').isMemberExpression() &&
			(path.get('callee.object') as NodePath).isIdentifier() &&
			(path.get('callee.property') as NodePath).isIdentifier({ name: 'dirname' }),
	);
}

function isProcessEnv(path: NodePath): boolean {
	// process.env
	return Boolean(
		path.isMemberExpression() &&
			(path.get('object') as NodePath).isMemberExpression() &&
			(path.get('object.object') as NodePath).isIdentifier({ name: 'process' }) &&
			(path.get('object.property') as NodePath).isIdentifier({ name: 'env' }),
	);
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

				// path.dirname(import.meta.url) -> __dirname
				// https://nodejs.org/api/esm.html#esm_no_filename_or_dirname
				// TODO: Is this needed?
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

				// __dirname -> path.dirname(import.meta.url)
				// https://nodejs.org/api/esm.html#esm_no_filename_or_dirname
				if (format === 'mjs' && path.isIdentifier({ name: '__dirname' })) {
					this.pathImport ??= addDefault(path, 'path', { nameHint: '_path' });

					const call = t.callExpression(
						t.memberExpression(
							t.identifier((this.pathImport as { name: string }).name),
							t.identifier('dirname'),
						),
						[
							t.memberExpression(
								t.metaProperty(t.identifier('import'), t.identifier('meta')),
								t.identifier('url'),
							),
						],
					);

					path.replaceWith(call);
				}

				// `NODE_PATH` is not allowed in esm files
				// https://nodejs.org/api/esm.html#esm_no_node_path
				if (
					format === 'mjs' &&
					path.isIdentifier({ name: 'NODE_PATH' }) &&
					isProcessEnv(path.parentPath)
				) {
					throw new Error(
						'Environment variable `process.env.NODE_PATH` is not available in modules.',
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
					path.get('property').isIdentifier({ name: 'url' }) &&
					!isPathDirname(path.parentPath)
				) {
					path.replaceWith(t.identifier('__filename'));
				}

				// `require.extensions` is not allowed in esm files
				// https://nodejs.org/api/esm.html#esm_no_require_extensions
				if (
					format === 'mjs' &&
					path.get('object').isIdentifier({ name: 'require' }) &&
					path.get('property').isIdentifier({ name: 'extensions' })
				) {
					throw new Error('API `require.extensions` is not available in modules.');
				}

				// `require.cache` is not allowed in esm files
				// https://nodejs.org/api/esm.html#esm_no_require_cache
				if (
					format === 'mjs' &&
					path.get('object').isIdentifier({ name: 'require' }) &&
					path.get('property').isIdentifier({ name: 'cache' })
				) {
					throw new Error('API `require.cache` is not available in modules.');
				}
			},
		},
	};
}
