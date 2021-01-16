class Client {
  prop: number = 123;
}

function* gen() {}

export function createClient() {
  for (const iterator of gen()) {
    console.log(iterator);
  }

  return new Client();
}
