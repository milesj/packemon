import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import type { Node } from 'acorn';
import MagicString from 'magic-string';
import { Plugin } from 'rollup';
import { ASSETS } from '../../constants';

function isAsset(id: string): boolean {
	return ASSETS.some((ext) => id.endsWith(ext));
}

function determineNewAsset(dir: string, source: string, importer?: string): string {
	const id = path.resolve(importer ? path.dirname(importer) : '', source);
	const ext = path.extname(id);
	const name = path.basename(id, ext);
	const hash = createHash('sha256').update(source).digest('hex').slice(0, 8);

	return path.join(dir, `${name}-${hash}${ext}`);
}

// We don't use `assetFileNames` as we want a single assets folder
// at the root of the package, which Rollup does not allow. It wants
// multiple asset folders within each format!
async function copyAsset(from: string, to: string) {
	await fs.promises.mkdir(path.dirname(to), { recursive: true });
	await fs.promises.copyFile(from, to);
}

export interface CopyAssetsPlugin {
	dir: string;
}

export function copyAndRefAssets({ dir }: CopyAssetsPlugin): Plugin {
	const assetsToCopy: Record<string, string> = {};

	return {
		name: 'package-assets',

		// Delete old assets to remove any possible stale assets
		async buildStart() {
			await fs.promises.rmdir(dir, { recursive: true });
		},

		// Find assets and mark as external
		resolveId(source, importer) {
			if (!isAsset(source)) {
				return null;
			}

			return { id: path.resolve(importer ? path.dirname(importer) : '', source), external: true };
		},

		// Update import declarations to new asset paths
		transform(code, id) {
			const ast = this.parse(code) as ProgramNode;

			if (!ast) {
				return undefined;
			}

			let hasChanged = false;
			const magicString = new MagicString(code);

			ast.body.forEach((node) => {
				if (node.type === 'ImportDeclaration') {
					const source = node.source.value;

					if (isAsset(source)) {
						const oldId = path.resolve(path.dirname(id), source);
						const newId = determineNewAsset(dir, source, id);

						assetsToCopy[oldId] = newId;

						hasChanged = true;

						magicString.overwrite(
							node.source.start,
							node.source.end,
							JSON.stringify(path.relative(id, newId)),
						);
					}
				}
			});

			if (!hasChanged) {
				return undefined;
			}

			return {
				// eslint-disable-next-line @typescript-eslint/no-base-to-string
				code: magicString.toString(),
				map: null,
			};
		},

		// Copy all found assets
		async generateBundle() {
			await Promise.all(
				Object.entries(assetsToCopy).map(async ([oldId, newId]) => {
					await copyAsset(oldId, newId);
				}),
			);
		},
	};
}

interface ImportDeclaration extends Node {
	type: 'ImportDeclaration';
	source: Node & { value: string };
}

interface ProgramNode extends Node {
	body: ImportDeclaration[];
}
