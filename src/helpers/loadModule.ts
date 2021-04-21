export function loadModule(name: string, message: string): unknown {
  try {
    // eslint-disable-next-line global-require
    return require(name);
  } catch {
    throw new Error(`${message} Please install with \`yarn add --dev ${name}\`.`);
  }
}
