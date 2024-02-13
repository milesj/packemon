import { createHash } from 'node:crypto';
import path from 'node:path';
import MagicString from 'magic-string';
import { Plugin } from 'rollup';
import { VirtualPath } from '@boost/common';
import type { TSESTree } from '@typescript-eslint/types';
import { ASSETS } from '../../constants';
import { FileSystem } from '../../FileSystem';

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
	fs: FileSystem;
}

export function copyAndRefAssets(
	{ dir, fs }: CopyAssetsOptions,
	assetsToCopyInit: Record<string, VirtualPath> = {},
): Plugin {
	const assetsToCopy = assetsToCopyInit;

	function determineNewAsset(source: string, importer?: string | null): VirtualPath {
		let preparedImporter = importer ? path.dirname(importer) : '';

		// Find overlapping directory names and remove them
		const normalizedRelativePath = path.normalize(source);
		const absoluteParts = preparedImporter.split(path.sep);
		const relativeParts = normalizedRelativePath.split(path.sep);

		for (let i = absoluteParts.length - 1; i >= 0; i -= 1) {
			if (
				absoluteParts[i] === relativeParts[0] &&
				absoluteParts.slice(i).every((p: string, idx: number) => p === relativeParts[idx])
			) {
				const overlap = absoluteParts.slice(i, absoluteParts.length).join(path.sep);
				preparedImporter = preparedImporter.slice(0, -overlap.length);
			}
		}

		const fullPath = path.join(preparedImporter, source);
		const id = new VirtualPath(fullPath);
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
		buildStart() {
			fs.remove(dir);
		},

		// Find assets and mark as external
		resolveId(source, importer) {
			if (isAsset(source) && importer) {
				const id = path.join(path.dirname(importer), source);

				// Check that the file actually exists, because they may be
				// using path aliases, or bundler specific syntax
				if (source.startsWith('.') && fs.exists(id)) {
					return { id, external: true };
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

			/*
				chunk.facadeModuleId is not ideal because the bundled code gets moved up to the
				root (output) directory compared to where it was located in the source files,
				the imports in the source files that get bundled get changed to be relative
				to the new bundle location, but the chunk.facadeModuleId is the old location of
				the index. So, you have the old path + the new updated imports and there could be
				overlap due to this "hoisting", which has a workaround in determineNewAsset
			*/
			const parentId = chunk.facadeModuleId; // This correct?
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

				if (!source?.value) {
					return;
				}

				// Update to new path (ignore files coming from node modules)
				const sourcePath = String(source.value);

				if (sourcePath.includes(':')) {
					return;
				}

				const parentDir = parentId ? path.dirname(parentId) : '';

				if (
					sourcePath &&
					isAsset(sourcePath) &&
					sourcePath.startsWith('.') &&
					fs.exists(path.join(parentDir, sourcePath))
				) {
					const newId = determineNewAsset(sourcePath, parentId);
					const importPath = options.preserveModules
						? new VirtualPath(path.relative(parentDir, newId.path())).path()
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
				fs.createDirAll(dir);
			}

			// We don't use `assetFileNames` as we want a single assets folder
			// at the root of the package, which Rollup does not allow. It wants
			// multiple asset folders within each format!
			await Promise.all(
				// eslint-disable-next-line @typescript-eslint/require-await
				Object.entries(assetsToCopy).map(async ([oldId, newId]) => {
					if (!newId.exists()) {
						fs.copyFile(oldId, newId.path());
					}
				}),
			);
		},
	};
}
