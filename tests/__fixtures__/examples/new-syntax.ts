export const foo: Record<string, string> = {};
export const optionalChain = foo?.bar;
export const nullCoalesc = foo ?? 0;

foo.bar ??= 'bar';
foo.baz ||= 'baz';
