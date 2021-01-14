import { checkPackageOutdated, Program } from '@boost/cli';
import {
  BuildCommand,
  CleanCommand,
  InitCommand,
  PackCommand,
  ValidateCommand,
  WatchCommand,
} from '.';

const version = String(require('../package.json').version);

async function run() {
  const program = new Program({
    bin: 'packemon',
    footer: 'Documentation: https://packemon.dev',
    name: 'Packemon',
    version,
  });

  program
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
