import { Format, Build, Platform } from '../types';

export default function getPlatformFromBuild(format: Format, build: Build): Platform {
  if (format === 'cjs' || format === 'mjs') {
    return 'node';
  }

  if (format === 'esm' || format === 'umd') {
    return 'browser';
  }

  // "lib" is a shared format across all platforms,
  // and when a package wants to support multiple platforms,
  // we must down-level the "lib" format to the lowest platform.
  if (build.flags.requiresSharedLib) {
    const platforms = new Set(build.platforms);

    if (platforms.has('browser')) {
      return 'browser';
    } else if (platforms.has('node')) {
      return 'node';
    }
  }

  return build.platforms[0];
}
