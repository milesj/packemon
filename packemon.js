/* eslint-disable no-underscore-dangle */

global.__DEV__ = true;
global.__PROD__ = false;

try {
	// Packemon built
	require('./lib/bin');
} catch {
	// TypeScript built (initial setup)
	require('./build/bin');
}
