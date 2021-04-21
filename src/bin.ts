import { checkPackageOutdated, Program } from '@boost/cli';
import { PackageStructure } from '@boost/common';
import {
  BuildCommand,
  CleanCommand,
  InitCommand,
  PackCommand,
  ValidateCommand,
  WatchCommand,
} from '.';

// eslint-disable-next-line global-require
const version = String((require('../package.json') as PackageStructure).version);

async function run() {
  const program = new Program({
    bin: 'packemon',
    footer: 'Documentation: https://packemon.dev',
    name: 'Packemon',
    version,
  });

  program
    .categories({
      filter: 'Filtering',
    })
    .middleware(checkPackageOutdated('packemon', version))
    .register(new BuildCommand())
    .register(new CleanCommand())
    .register(new InitCommand())
    .register(new PackCommand())
    .register(new ValidateCommand())
    .register(new WatchCommand());

  await program.runAndExit(process.argv);
}

void run();
