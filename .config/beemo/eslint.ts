export default {
	rules: {
		// Broken on windows
		'import/named': 'off',
		// Doesnt work with `package.json` exports
		'import/no-unresolved': 'off',
		// Were using new automatic mode
		'react/react-in-jsx-scope': 'off',
	},
	ignore: ['scenarios/'],
};
