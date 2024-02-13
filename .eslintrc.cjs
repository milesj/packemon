module.exports = {
	root: true,
	extends: ['moon', 'moon/react', 'moon/node'],
	parserOptions: {
		project: 'tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
	},
	rules: {
		// Doesnt work with `package.json` exports
		'import/no-unresolved': 'off',
		// Very buggy?
		'node/no-unpublished-import': 'off',
	},
};
