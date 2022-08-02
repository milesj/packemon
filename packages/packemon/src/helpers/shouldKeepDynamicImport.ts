import { Platform, Support } from '../types';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility
export function shouldKeepDynamicImport(platform: Platform, support: Support): boolean {
	// Defer browser/native to Babel
	return platform === 'node' ? support !== 'legacy' : false;
}
