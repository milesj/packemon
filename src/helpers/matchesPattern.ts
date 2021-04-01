import micromatch from 'micromatch';

export function matchesPattern(value: string, pattern: string) {
  const patterns = pattern.split(',');

  return micromatch.isMatch(value, patterns) || patterns.includes(value);
}
