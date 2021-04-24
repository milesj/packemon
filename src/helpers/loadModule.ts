export function loadModule(name: string, message: string): unknown {
  try {
    return require(name);
  } catch {
    throw new Error(`${message} Please install with \`yarn add --dev ${name}\`.`);
  }
}
