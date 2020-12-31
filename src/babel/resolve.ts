// Babel resolves plugins against the current working directory
// and will not find globally installed dependencies unless we resolve.
// This is also in a separate file so that we can mock in tests.
export default function resolve(path: string): string {
  return require.resolve(path);
}
