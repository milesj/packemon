import { Path, deepMerge, parseFile } from '@boost/common';
import { TSConfigStructure } from '../types';

const cache: Record<string, TSConfigStructure> = {};

export default function resolveTsConfig(path: Path): TSConfigStructure {
  const cacheKey = path.path();

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  let contents = parseFile<TSConfigStructure>(path);

  if (contents.extends) {
    // @ts-expect-error Types need to be fixed upstream
    contents = deepMerge(resolveTsConfig(path.parent().append(contents.extends)), contents);
  }

  cache[cacheKey] = contents;

  return contents;
}
