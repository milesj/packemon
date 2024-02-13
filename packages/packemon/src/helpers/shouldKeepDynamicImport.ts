import { Format, Platform } from '../types';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility
export function shouldKeepDynamicImport(platform: Platform, format: Format): boolean {
	if (format === 'umd') {
		return false;
	}

	switch (platform) {
		case 'node':
			// >= v13.2
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#browser_compatibility
			return true;
		case 'electron':
		case 'browser':
			// >= 2019
			// https://caniuse.com/es6-module-dynamic-import
			return true;
		case 'native':
			// >= RN 0.72
			// https://metrobundler.dev/docs/module-api/#import-dynamic-import
			return true;
		default:
			return false;
	}
}
