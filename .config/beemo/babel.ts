const plugins: object[] = [];

if (!process.env.NO_INTEROP) {
	// Needed for Jest
	plugins.push(['babel-plugin-cjs-esm-interop', { format: 'cjs' }]);
}

export default {
	plugins,
};
