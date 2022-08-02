describe('Resolves', () => {
	// These all fail since Jest doesnt resolve the `import` condition by default for jsdom
	it('imports esm', async () => {
		// expect(await import('esm-exports-js').then((mod) => mod.default)).toBe('esm-exports-js');
		// expect(await import('esm-exports-js-module').then((mod) => mod.default)).toBe(
		// 	'esm-exports-js-module',
		// );
		// expect(await import('esm-exports-mjs').then((mod) => mod.default)).toBe('esm-exports-mjs');
		// expect(await import('esm-module-js').then((mod) => mod.default)).toBe('esm-module-js');
		// expect(await import('esm-module-js-module').then((mod) => mod.default)).toBe(
		// 	'esm-module-js-module',
		// );
		// expect(await import('esm-module-mjs').then((mod) => mod.default)).toBe('esm-module-mjs');
	});

	it('handles conditions', async () => {
		expect(await import('dual-exports-conditions').then((mod) => mod.default)).toBe(
			'dual-exports-conditions (browser-default)',
		);
	});
});
