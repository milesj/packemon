import { Path, parseFile } from '@boost/common';
import { TSConfigStructure } from '../types';

export default function resolveTsConfig(path: Path): TSConfigStructure {
  const contents = parseFile<TSConfigStructure>(path);

  // TODO deep merge
  if (contents.extends) {
    return {
      ...resolveTsConfig(path.parent().append(contents.extends)),
      ...contents,
    };
  }

  return contents;
}
