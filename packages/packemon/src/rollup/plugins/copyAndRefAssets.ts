import { createHash } from 'node:crypto';
import path from 'node:path';
import fs from 'fs-extra';
import MagicString from 'magic-string';
import { Plugin } from 'rollup';
import { VirtualPath } from '@boost/common';
import type { TSESTree } from '@typescript-eslint/types';
import { ASSETS } from '../../constants';

function isAsset(id: string): boolean {
	return ASSETS.some((ext) => id.endsWith(ext));
}

function isRequireStatement(node: TSESTree.Expression): node is TSESTree.CallExpression {
	return (
		node &&
		node.type === 'CallExpression' &&
		node.callee &&
		node.callee.type === 'Identifier' &&
		node.callee.name === 'require' &&
		node.arguments.length > 0 &&
		node.arguments[0] &&
		node.arguments[0].type === 'Literal'
	);
}

export interface CopyAssetsOptions {
	dir: string;
}

export function copyAndRefAssets({ dir }: CopyAssetsOptions): Plugin {
	const assetsToCopy: Record<string, VirtualPath> = {};

	function determineNewAsset(source: string, importer?: string): VirtualPath {
		const id = new VirtualPath(importer ? path.dirname(importer) : '', source);
		const ext = id.ext();
		const name = id.name(true);

		// Generate a hash of the source file path,
		// and have it match between nix and windows
		const hash = createHash('sha256')
			.update(id.path().replace(new VirtualPath(path.dirname(dir)).path(), ''))
			.digest('hex')
			.slice(0, 8);

		// Create a new path that points to the assets folder
		const newId = new VirtualPath(dir, `${name}-${hash}${ext}`);

		assetsToCopy[id.path()] = newId;

		return newId;
	}

	return {
		name: 'packemon-copy-and-ref-assets',

		// Delete old assets to remove any possible stale assets
		async buildStart() {
			await fs.remove(dir);
		},

		// Find assets and mark as external
		resolveId(source, importer) {
			if (isAsset(source)) {
				if (source.startsWith('.')) {
					return { id: path.join(path.dirname(importer!), source), external: true };
				}

				// Ignore files coming from node modules
				return false;
			}

			return null;
		},

		// Update import/require declarations to new asset paths
		renderChunk(code, chunk, options) {
			let ast: TSESTree.Program;

			try {
				ast = this.parse(code) as unknown as TSESTree.Program;
			} catch {
				// Unknown syntax may fail parsing, not much we can do here?
				return null;
			}

			const parentId = chunk.facadeModuleId!; // This correct?
			const magicString = new MagicString(code);
			let hasChanged = false;

			// eslint-disable-next-line complexity
			ast.body.forEach((node) => {
				let source: TSESTree.Literal | undefined;

				// import './styles.css';
				if (node.type === 'ImportDeclaration') {
					({ source } = node);

					// require('./styles.css');
				} else if (node.type === 'ExpressionStatement' && isRequireStatement(node.expression)) {
					source = node.expression.arguments[0] as TSESTree.Literal;

					// const foo = require('./styles.css');
				} else if (
					node.type === 'VariableDeclaration' &&
					node.declarations.length > 0 &&
					node.declarations[0].init &&
					isRequireStatement(node.declarations[0].init)
				) {
					source = node.declarations[0].init.arguments[0] as TSESTree.Literal;
				}

				// Update to new path (ignore files coming from node modules)
				if (
					source?.value &&
					isAsset(String(source.value)) &&
					String(source.value).startsWith('.')
				) {
					const newId = determineNewAsset(String(source.value), parentId);
					const importPath = options.preserveModules
						? new VirtualPath(path.relative(path.dirname(parentId), newId.path())).path()
						: `../assets/${newId.name()}`;

					// @ts-expect-error Not typed
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					magicString.overwrite(source.start, source.end, `'${importPath}'`);
					hasChanged = true;
				}
			});

			if (!hasChanged) {
				return null;
			}

			return {
				code: magicString.toString(),
				map: null,
			};
		},

		// Copy all found assets
		async generateBundle() {
			// Only create the folder if we have assets to copy,
			// otherwise it throws off `files` and other detection!
			if (Object.keys(assetsToCopy).length > 0) {
				await fs.mkdir(dir, { recursive: true });
			}

			// We don't use `assetFileNames` as we want a single assets folder
			// at the root of the package, which Rollup does not allow. It wants
			// multiple asset folders within each format!
			await Promise.all(
				Object.entries(assetsToCopy).map(async ([oldId, newId]) => {
					if (!newId.exists()) {
						await fs.copyFile(oldId, newId.path());
					}
				}),
			);
		},
	};
}
