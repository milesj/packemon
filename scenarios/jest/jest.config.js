module.exports = {
	preset: 'jest-preset-beemo',
	testEnvironment: 'jsdom',
	testEnvironmentOptions: {
		customExportConditions: ['browser'],
	},
};
