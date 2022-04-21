export let foo = 'abc';
export const bar = 123;
export const { baz } = { baz: true };
export const [qux] = [{}];

export class ClassName {}
export function func() {}
export const arrowFunc = () => {};

const CONST = 123;
export { CONST };

export default class DefaultClass {}
