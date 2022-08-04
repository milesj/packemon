import dualExportsJs from 'dual-exports-js';
import dualExportsCjsMjs from 'dual-exports-cjs-mjs';
import dualExportsConditions from 'dual-exports-conditions';
import dualModuleJs from 'dual-module-js';
import dualModuleCjsMjs from 'dual-module-cjs-mjs';

describe('Resolves', () => {
	it('imports cjs/js correctly', async () => {
		expect(dualExportsJs).toBe('dual-exports-js (main)');
		expect(dualExportsCjsMjs).toBe('dual-exports-cjs-mjs (main)');
		expect(dualModuleJs).toBe('dual-module-js (main)');
		expect(dualModuleCjsMjs).toBe('dual-module-cjs-mjs (main)');

		expect(await import('dual-exports-js').then((mod) => mod.default)).toBe(
			'dual-exports-js (main)',
		);
		expect(await import('dual-exports-cjs-mjs').then((mod) => mod.default)).toBe(
			'dual-exports-cjs-mjs (main)',
		);
		expect(await import('dual-module-js').then((mod) => mod.default)).toBe('dual-module-js (main)');
		expect(await import('dual-module-cjs-mjs').then((mod) => mod.default)).toBe(
			'dual-module-cjs-mjs (main)',
		);
	});

	it('handles conditions', async () => {
		expect(dualExportsConditions).toBe('dual-exports-conditions (browser-default)');

		expect(await import('dual-exports-conditions').then((mod) => mod.default)).toBe(
			'dual-exports-conditions (browser-default)',
		);
	});
});
