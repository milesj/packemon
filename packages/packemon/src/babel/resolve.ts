// This is in a separate file so that we can mock in tests

import { createRequire } from 'module';
import path from 'path';
import doResolve from 'resolve';

// Babel resolves plugins against the current working directory
// and will not find globally installed dependencies unless we resolve.
// istanbul ignore next
export function resolve(id: string): string {
	return doResolve.sync(id, { basedir: path.dirname(import.meta.url) });
}

// Furthermore, some plugins are dependents of Babel and not Packemon,
// so we need to resolve from that context for PnP to work correctly.
const babelRequire = createRequire(resolve('@babel/preset-env/package.json'));

export function resolveFromBabel(id: string): string {
	return babelRequire.resolve(id);
}
