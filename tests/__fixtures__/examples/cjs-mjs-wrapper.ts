import type { Baz } from './helpers';
import { type Baz as BazRenamed } from './helpers';
import * as ns1 from './helpers';

export { ns1, ns1 as ns2 };
export { foo as fooRenamed } from './helpers';
export * as ns3 from './helpers';
export * from './helpers';

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
export default class DefaultClass {}

// Types should be ignored
export type Type = string;
export interface Interface {}
type LocalType = boolean;
export { Baz, LocalType };
export type { BazRenamed };
