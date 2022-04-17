import { StyleType } from '@boost/cli';
import {
	ArtifactState,
	BrowserFormat,
	Format,
	NativeFormat,
	NodeFormat,
	Platform,
	Support,
} from './types';

export const ASSETS = [
	// Styles
	'.css',
	'.scss',
	'.sass',
	'.less',
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

export const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs'];

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
	legacy: 'iOS 8',
	stable: 'iOS 10',
	current: 'iOS 12',
	experimental: 'iOS 14',
};

// Based on LTS schedule: https://nodejs.org/en/about/releases/
export const NODE_SUPPORTED_VERSIONS: { [K in Support]: string } = {
	legacy: '12.22.0',
	stable: '14.15.0', // LTS support started
	current: '16.12.0', // ESM loader hooks
	experimental: '18.0.0',
};

export const NPM_SUPPORTED_VERSIONS: { [K in Support]: string[] | string } = {
	legacy: '6.14.0',
	stable: '6.14.0',
	current: '8.1.0',
	experimental: '8.5.0',
};

// Based on browserslist: https://github.com/browserslist/browserslist
export const BROWSER_TARGETS: { [K in Support]: string[] | string } = {
	legacy: 'IE 11',
	stable: ['defaults', 'not IE 11'],
	current: ['> 1%', 'not dead'],
	experimental: ['last 2 chrome versions', 'last 2 firefox versions'],
};

export const SUPPORT_TO_ESM_SPEC = {
	legacy: 'es5',
	stable: 'es2018',
	current: 'es2020',
	experimental: 'es2022',
} as const;

export const STATE_COLORS: { [K in ArtifactState]?: StyleType } = {
	pending: 'muted',
	passed: 'success',
	failed: 'failure',
};

export const STATE_LABELS: { [K in ArtifactState]: string } = {
	pending: '',
	building: 'Building',
	passed: 'Passed',
	failed: 'Failed',
};

export const DEFAULT_FORMATS: Record<Platform, Format[]> = {
	browser: ['lib', 'esm'],
	native: ['lib'],
	node: ['mjs'],
};

export const FORMATS_BROWSER: BrowserFormat[] = ['lib', 'esm', 'umd'];

export const FORMATS_NATIVE: NativeFormat[] = ['lib'];

export const FORMATS_NODE: NodeFormat[] = ['lib', 'mjs', 'cjs'];

export const FORMATS: Format[] = ['lib', 'esm', 'umd', 'mjs', 'cjs'];

export const DEFAULT_INPUT = 'src/index.ts';

export const DEFAULT_PLATFORM: Platform = 'browser';

export const PLATFORMS: Platform[] = ['native', 'node', 'browser'];

export const DEFAULT_SUPPORT: Support = 'stable';

export const SUPPORTS: Support[] = ['legacy', 'stable', 'current', 'experimental'];

export const SUPPORT_PRIORITY: Record<Support, number> = {
	legacy: 0,
	stable: 1,
	current: 2,
	experimental: 3,
};
