import { createHash } from 'crypto';
import path from 'path';
import type { Node } from 'acorn';
import fs from 'fs-extra';
import MagicString from 'magic-string';
import rimraf from 'rimraf';
import { Plugin } from 'rollup';
import { VirtualPath } from '@boost/common';
import { ASSETS } from '../../constants';

function isAsset(id: string): boolean {
	return ASSETS.some((ext) => id.endsWith(ext));
}

function isRequireStatement(node: CallExpression): boolean {
	return (
		node &&
		node.type === 'CallExpression' &&
		node.callee &&
		node.callee.type === 'Identifier' &&
		node.callee.name === 'require' &&
		node.arguments.length > 0
	);
}

export interface CopyAssetsPlugin {
	dir: string;
}

export function copyAndRefAssets({ dir }: CopyAssetsPlugin): Plugin {
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
			await new Promise((resolve, reject) => {
				rimraf(dir, (error) => {
					if (error) {
						reject(error);
					} else {
						resolve(undefined);
					}
				});
			});
		},

		// Find assets and mark as external
		resolveId(source) {
			if (isAsset(source)) {
				return { id: source, external: true };
			}

			return null;
		},

		// Update import/require declarations to new asset paths
		renderChunk(code, chunk, options) {
			let ast: ProgramNode;

			try {
				ast = this.parse(code) as ProgramNode;
			} catch {
				// Unknown syntax may fail parsing, not much we can do here?
				return null;
			}

			const parentId = chunk.facadeModuleId!; // This correct?
			const magicString = new MagicString(code);
			let hasChanged = false;

			ast.body.forEach((node) => {
				let source: Literal | undefined;

				// import './styles.css';
				if (node.type === 'ImportDeclaration') {
					({ source } = node);

					// require('./styles.css');
				} else if (node.type === 'ExpressionStatement' && isRequireStatement(node.expression)) {
					source = node.expression.arguments[0];

					// const foo = require('./styles.css');
				} else if (
					node.type === 'VariableDeclaration' &&
					node.declarations.length > 0 &&
					isRequireStatement(node.declarations[0].init)
				) {
					source = node.declarations[0].init.arguments[0];
				}

				// Update to new path
				if (source?.value && isAsset(source.value)) {
					const newId = determineNewAsset(source.value, parentId);

					const importPath = options.preserveModules
						? new VirtualPath(path.relative(path.dirname(parentId), newId.path())).path()
						: `../assets/${newId.name()}`;

					hasChanged = true;
					magicString.overwrite(source.start, source.end, `'${importPath}'`);
				}
			});

			if (!hasChanged) {
				return null;
			}

			return {
				// eslint-disable-next-line @typescript-eslint/no-base-to-string
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

interface Literal extends Node {
	value: string;
}

interface Identifier extends Node {
	type: 'Identifier';
	name: string;
}

interface ImportDeclaration extends Node {
	type: 'ImportDeclaration';
	source: Literal;
}

interface ExpressionStatement extends Node {
	type: 'ExpressionStatement';
	expression: CallExpression;
}

interface CallExpression extends Node {
	type: 'CallExpression';
	callee: Identifier;
	arguments: Literal[];
}

interface VariableDeclaration extends Node {
	type: 'VariableDeclaration';
	declarations: VariableDeclarator[];
}

interface VariableDeclarator extends Node {
	type: 'VariableDeclarator';
	id: Identifier;
	init: CallExpression;
}

interface ProgramNode extends Node {
	body: (ExpressionStatement | ImportDeclaration | VariableDeclaration)[];
}
