import path from 'path';

/**
 * Return the file extension without leading period, or an empty string if not found.
 */
export default function getExtFromPath(filePath: string): string {
  const ext = path.extname(filePath);

  return ext ? ext.slice(1) : ext;
}
