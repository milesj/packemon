import { vi } from 'vitest';

class Spy {
	called: boolean = false;

	mock = () => {};

	method() {}
}

export function spy() {
	const inst = new Spy();

	return vi.fn(inst.mock);
}

export async function wait(): Promise<void> {}
