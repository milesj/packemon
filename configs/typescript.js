module.exports = {
  compilerOptions: {
    // We dont want to the TS build to conflicts with Packemon's build,
    // so lets output the original TS build to another folder temporarily.
    outDir: 'build',
  },
};
