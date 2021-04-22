export default {
  compilerOptions: {
    // We dont want the TS build to conflict with Packemon's build,
    // so lets output the original TS build to another folder temporarily.
    outDir: 'build',
    module: 'commonjs',
    target: 'es2018',
    // This changes the structure of the DTS output folder, so avoid it.
    resolveJsonModule: false,
  },
};
