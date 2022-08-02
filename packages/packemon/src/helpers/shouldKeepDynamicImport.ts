import { Platform, Support } from '../types';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility
export function shouldKeepDynamicImport(platform: Platform, support: Support): boolean {
	switch (platform) {
		case 'node':
			// >= v13.2
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#browser_compatibility
			return support !== 'legacy';
		case 'browser':
			// >= 2019
			// https://caniuse.com/es6-module-dynamic-import
			return true;
		default:
			// RN does not support code splitting
			// https://github.com/facebook/metro/issues/52
			return false;
	}
}
