export const apiExtractorConfig = {
	$schema:
		'https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json',
	projectFolder: '.',
	mainEntryPointFilePath: '<projectFolder>/build/index.d.ts',
	bundledPackages: [],
	compiler: {
		tsconfigFilePath: '<projectFolder>/tsconfig.json',
	},
	apiReport: {
		enabled: false,
	},
	docModel: {
		enabled: false,
	},
	dtsRollup: {
		enabled: true,
		untrimmedFilePath: '<projectFolder>/dts/index.d.ts',
		omitTrimmingComments: false,
	},
	tsdocMetadata: {
		enabled: false,
	},
	messages: {
		compilerMessageReporting: {
			default: {
				logLevel: 'warning',
			},
		},
		extractorMessageReporting: {
			default: {
				logLevel: 'warning',
			},
			'ae-missing-release-tag': {
				logLevel: 'none',
			},
		},
		tsdocMessageReporting: {
			default: {
				logLevel: 'warning',
			},
		},
	},
};
