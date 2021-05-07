import path from 'path';
import { BabelFileResult } from '@babel/core';

export function formatSourcemap(
  map: NonNullable<BabelFileResult['map']>,
  inFile: string,
  outFile: string,
) {
  const data = {
    ...map,
    file: path.basename(outFile),
    sourcesContent: null,
  };

  // Rollup sources are relative to the actual source file, while Babel
  // is just the name of the source file. Match Rollup's implementation.
  if (data.sources?.length > 0) {
    data.sources = [path.relative(path.dirname(outFile), inFile)];
  }

  return JSON.stringify(data);
}
