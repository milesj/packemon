declare module 'rollup-plugin-smart-asset' {
	import { Plugin } from 'rollup';

	export interface PluginSmartAssetOptions {
		url: 'copy' | 'inline' | 'rebase';
		rebasePath?: string;
		maxSize?: number;
		publicPath?: string;
		assetsPath?: string;
		emitFiles?: boolean;
		preserveModules?: boolean;
		outputDir?: string;
		inputFile?: string;
		useHash?: boolean;
		keepName?: boolean;
		nameFormat?: string;
		hashOptions?: {
			hash: string;
			encoding: string;
			maxLength: number;
		};
		keepImport?: boolean;
		sourceMap?: boolean;
		sourcemap?: boolean;
		include?: string[];
		exclude?: string[];
		extensions?: string[];
	}

	export declare const smartAsset: (opts?: PluginSmartAssetOptions) => Plugin;
	export default smartAsset;
}
