module.exports = {
	preset: 'jest-preset-moon',
	testEnvironment: 'jsdom',
	testEnvironmentOptions: {
		customExportConditions: ['browser'],
	},
};
