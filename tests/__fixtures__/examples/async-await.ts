export async function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}

export async function run() {
  try {
    await wait();
  } catch {
    throw new Error('Fail');
  }
}
