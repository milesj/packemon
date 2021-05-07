import { BundleBuild } from '../types';

export function getOutputBanner({ platform, support, format }: BundleBuild): string {
  return [
    '// Generated with Packemon: https://packemon.dev\n',
    `// Platform: ${platform}, Support: ${support}, Format: ${format}\n\n`,
  ].join('');
}
