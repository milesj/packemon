export default {
	compilerOptions: {
		jsx: 'react-jsx',
		outDir: 'build',
		// This changes the structure of the DTS output folder, so avoid it.
		resolveJsonModule: false,
	},
	include: ['src/**/*', 'tests/**/*', 'types/**/*'],
};
