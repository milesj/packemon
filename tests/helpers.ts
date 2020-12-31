export function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function mockSpy(instance: unknown): jest.SpyInstance {
  return instance as jest.SpyInstance;
}
