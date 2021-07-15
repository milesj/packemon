// This is in a separate file so that we can mock in tests

import { createRequire } from 'module';

// Babel resolves plugins against the current working directory
// and will not find globally installed dependencies unless we resolve.
// istanbul ignore next
export function resolve(path: string): string {
	return require.resolve(path);
}

// Furthermore, some plugins are dependents of Babel and not Packemon,
// so we need to resolve from that context for PnP to work correctly.
const babelRequire = createRequire(resolve('@babel/preset-env/package.json'));

export function resolveFromBabel(path: string): string {
	return babelRequire.resolve(path);
}
