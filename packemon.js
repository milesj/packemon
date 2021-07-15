/* eslint-disable no-underscore-dangle */

global.__DEV__ = true;
global.__PROD__ = false;

try {
	// Packemon built
	require('./packages/packemon/lib/bin');
} catch {
	// Babel built (initial setup)
	require('./build/bin');
}
