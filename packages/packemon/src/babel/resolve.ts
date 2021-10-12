// This is in a separate file so that we can mock in tests

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import doResolve from 'resolve';

// Babel resolves plugins against the current working directory
// and will not find globally installed dependencies unless we resolve.
// istanbul ignore next
export function resolve(id: string): string {
	let file = import.meta.url;

	// Because of our Babel plugin and Rollup, this may get transpiled differently
	// @ts-expect-error Allow this instance check
	if (file instanceof URL || (typeof file === 'string' && file.startsWith('file:'))) {
		file = fileURLToPath(file);
	}

	return doResolve.sync(id, { basedir: path.dirname(file) });
}

// Furthermore, some plugins are dependents of Babel and not Packemon,
// so we need to resolve from that context for PnP to work correctly.
const babelRequire = createRequire(resolve('@babel/preset-env/package.json'));

export function resolveFromBabel(id: string): string {
	return babelRequire.resolve(id);
}
