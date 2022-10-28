import { createRequire } from 'node:module';

const modRequire = createRequire(import.meta.url);

export function loadModule(name: string, message: string): unknown {
	try {
		return modRequire(name);
	} catch {
		throw new Error(`${message} Please install with \`yarn add --dev ${name}\`.`);
	}
}
