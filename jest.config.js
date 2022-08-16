module.exports = {
	preset: 'jest-preset-moon',
	coveragePathIgnorePatterns: [
		'src/commands',
		'src/components',
		'tests/__fixtures__',
		'tests/helpers.ts',
		'website',
	],
	extensionsToTreatAsEsm: [],
	testEnvironment: 'node',
	testPathIgnorePatterns: ['scenarios'],
};
