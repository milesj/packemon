/* eslint-disable import/no-default-export */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		conditions: ['node'],
	},
	test: {
		passWithNoTests: true,
		setupFiles: [path.join(path.dirname(fileURLToPath(import.meta.url)), './tests/setup.ts')],
	},
});
