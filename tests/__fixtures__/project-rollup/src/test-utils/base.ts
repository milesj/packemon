class Spy {
  called: boolean = false;

  mock = () => {};

  method() {}
}

export function spy() {
  const inst = new Spy();

  return jest.fn(inst.mock);
}

export async function wait() {}
