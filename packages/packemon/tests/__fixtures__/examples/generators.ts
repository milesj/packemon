export function* gen() {}

export function runGen() {
	for (const iterator of gen()) {
		console.log(iterator);
	}
}
