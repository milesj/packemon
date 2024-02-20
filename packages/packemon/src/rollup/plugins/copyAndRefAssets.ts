import { createHash } from 'node:crypto';
import fsn from 'node:fs';
import path from 'node:path';
import MagicString from 'magic-string';
import { Plugin } from 'rollup';
import { VirtualPath } from '@boost/common';
import type { TSESTree } from '@typescript-eslint/types';
import { ASSETS, TEXT_ASSETS } from '../../constants';
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
	const assetSourceMap = new Set<string>();

	function findMatchingSource(relSource: string): string | undefined {
		if (relSource.includes(':')) {
			return undefined;
		}

		let source = relSource;

		while (source.startsWith('.')) {
			source = source.replace('../', '').replace('./', '');
		}

		for (const id of assetSourceMap) {
			if (id.endsWith(source)) {
				return id;
			}
		}

		return undefined;
	}

	function determineNewAsset(absSource: string): VirtualPath {
		const id = new VirtualPath(absSource);
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
			if (fs.exists(dir) && process.env.NODE_ENV !== 'test') {
				fs.removeDir(dir);
			}
		},

		// Find assets and mark as external
		resolveId(source, importer) {
			if (isAsset(source) && importer) {
				const id = path.join(path.dirname(importer), source);

				// Check that the file actually exists, because they may be
				// using path aliases, or bundler specific syntax
				if (source.startsWith('.') && fs.exists(id)) {
					assetSourceMap.add(id);

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

			const magicString = new MagicString(code);
			let hasChanged = false;

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
				const relSource = String(source.value);
				const absSource = findMatchingSource(relSource);

				if (absSource) {
					const newId = determineNewAsset(absSource);
					const parentDir = path.dirname(chunk.facadeModuleId!);
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
		async generateBundle(options, bundle) {
			// Only create the folder if we have assets to copy,
			// otherwise it throws off `files` and other detection!
			if (Object.keys(assetsToCopy).length > 0) {
				fs.createDirAll(dir);
			}

			// We don't use `assetFileNames` or `emitFile` as we want a single assets folder
			// at the root of the package, which Rollup does not allow. It wants
			// multiple asset folders within each format!
			await Promise.all(
				// eslint-disable-next-line @typescript-eslint/require-await
				Object.entries(assetsToCopy).map(async ([oldId, newId]) => {
					const newName = newId.name();
					const isStringSource = TEXT_ASSETS.some((ext) => newName.endsWith(ext));

					// eslint-disable-next-line no-param-reassign
					bundle[newId.path()] = {
						fileName: `../assets/${newName}`,
						name: undefined,
						needsCodeReference: false,
						source: isStringSource ? fs.readFile(oldId) : fsn.readFileSync(oldId),
						type: 'asset',
					};
				}),
			);
		},
	};
}
