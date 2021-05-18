export function removeSourcePath(file: string): string {
  return file.replace('src/', '').replace(/\.[a-z]{2,3}$/, '');
}
