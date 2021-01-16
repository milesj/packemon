class Client {
  prop: number = 123;
}

function* gen() {}

async function wait() {}

export async function createClient() {
  await wait();

  for (const iterator of gen()) {
    console.log(iterator);
  }

  return new Client();
}
