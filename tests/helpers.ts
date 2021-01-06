import Artifact from '../src/Artifact';

export function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function mockSpy(instance: unknown): jest.SpyInstance {
  return instance as jest.SpyInstance;
}

export class TestArtifact extends Artifact {
  log = this.logWithSource;

  build() {
    // eslint-disable-next-line no-magic-numbers
    return delay(50);
  }

  getBuildTargets() {
    return ['test'];
  }

  getLabel() {
    return 'test';
  }
}
