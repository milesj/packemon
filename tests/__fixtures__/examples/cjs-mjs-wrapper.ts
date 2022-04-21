import * as ns1 from './helpers';

export { ns1, ns1 as ns2 };
export * as ns3 from './helpers';

export let a = 'abc';
export const b = 123;
export const { c } = { c: true };
export const [d] = [{}];
export const e = 456,
	f = 'xyz';

export class ClassName {}
export function func() {}
export const arrowFunc = () => {};

const CONST = 123;
export { CONST };

export * from './helpers';

export default class DefaultClass {}
