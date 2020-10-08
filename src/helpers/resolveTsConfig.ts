import { Path, parseFile } from '@boost/common';
import { TSConfigStructure } from '../types';

const cache: Record<string, TSConfigStructure> = {};

export default function resolveTsConfig(path: Path): TSConfigStructure {
  const cacheKey = path.path();

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  let contents = parseFile<TSConfigStructure>(path);

  // TODO deep merge
  if (contents.extends) {
    contents = {
      ...resolveTsConfig(path.parent().append(contents.extends)),
      ...contents,
    };
  }

  cache[cacheKey] = contents;

  return contents;
}
