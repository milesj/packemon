import type { StyleType } from '@boost/cli';
import type {
	ArtifactState,
	BrowserFormat,
	Format,
	NativeFormat,
	NodeFormat,
	Platform,
	Support,
} from './types';

export const TEXT_ASSETS = [
	// Styles
	'.css',
	'.scss',
	'.sass',
	'.less',
];

export const BINARY_ASSETS = [
	// Images
	'.svg',
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.webp',
	// Audio
	'.ogg',
	'.mp3',
	'.mpe',
	'.mpeg',
	'.wav',
	// Video
	'.mp4',
	'.mov',
	'.avi',
	'.webm',
	// Fonts
	'.woff',
	'.woff2',
	'.ttf',
];

export const ASSETS = [...TEXT_ASSETS, ...BINARY_ASSETS];

export const EXTENSIONS = ['.ts', '.tsx', '.cts', '.mts', '.js', '.jsx', '.cjs', '.mjs'];

export const EXCLUDE = [
	'**/node_modules/**',
	'**/tests/**',
	'**/__fixtures__/**',
	'**/__mocks__/**',
	'**/__tests__/**',
	'**/*.(config|test|spec).*',
	'**/*-(test|spec).*',
];

// Rust (swc) uses regex patterns
export const EXCLUDE_RUST = [
	'node_modules',
	'tests',
	'__fixtures__',
	'__mocks__',
	'__tests__',
	'\\.(config|test|spec)\\.[a-z]+$',
	'\\.(test|spec)\\.[a-z]+$',
];

// https://reactnative.dev/docs/javascript-environment
// Based on browserslist: https://github.com/browserslist/browserslist
export const NATIVE_TARGETS: { [K in Support]: string } = {
	legacy: 'iOS 14', // 2020
	stable: 'iOS 15', // 2021
	current: 'iOS 16', // 2022
	experimental: 'iOS 17', // 2023
};

// Based on LTS schedule: https://nodejs.org/en/about/releases/
export const NODE_SUPPORTED_VERSIONS: { [K in Support]: string } = {
	legacy: '16.12.0', // ESM loader hooks
	stable: '18.12.0', // LTS support started
	current: '20.10.0', // Detect module / CJS compat
	experimental: '21.6.0',
};

export const NPM_SUPPORTED_VERSIONS: { [K in Support]: string } = {
	legacy: '8.1.0',
	stable: '8.19.0',
	current: '10.0.0',
	experimental: '10.4.0',
};

// Based on browserslist: https://github.com/browserslist/browserslist
export const BROWSER_TARGETS: { [K in Support]: string[] | string } = {
	legacy: ['>=0.10%', 'not IE 11'],
	stable: ['defaults', 'not IE 11'],
	current: ['>=1%', 'not dead'],
	experimental: ['last 2 chrome versions', 'last 2 firefox versions'],
};

export const ELECTRON_TARGETS: { [K in Support]: string } = {
	legacy: '11.0.0', // Nov 2020
	stable: '16.0.0', // Nov 2021
	current: '21.0.0', // Sep 2022
	experimental: '26.0.0', // June 2023
};

export const SUPPORT_TO_ESM_SPEC = {
	legacy: 'es2019',
	stable: 'es2020',
	current: 'es2021',
	experimental: 'es2022',
} as const;

export const STATE_COLORS: { [K in ArtifactState]?: StyleType } = {
	pending: 'muted',
	passed: 'success',
	failed: 'failure',
};

export const DEFAULT_FORMATS: Record<Platform, Format> = {
	browser: 'esm',
	electron: 'esm',
	native: 'esm',
	node: 'mjs',
};

export const FORMATS_BROWSER: BrowserFormat[] = ['lib', 'esm', 'umd'];

export const FORMATS_ELECTRON: BrowserFormat[] = ['lib', 'esm'];

export const FORMATS_NATIVE: NativeFormat[] = ['lib', 'esm'];

export const FORMATS_NODE: NodeFormat[] = ['lib', 'mjs', 'cjs'];

export const FORMATS: Format[] = ['lib', 'esm', 'umd', 'mjs', 'cjs'];

export const DEFAULT_INPUT = 'src/index.ts';

export const DEFAULT_PLATFORM: Platform = 'browser';

export const PLATFORMS: Platform[] = ['native', 'electron', 'node', 'browser'];

export const DEFAULT_SUPPORT: Support = 'stable';

export const SUPPORTS: Support[] = ['legacy', 'stable', 'current', 'experimental'];

export const SUPPORT_PRIORITY: Record<Support, number> = {
	legacy: 0,
	stable: 1,
	current: 2,
	experimental: 3,
};
