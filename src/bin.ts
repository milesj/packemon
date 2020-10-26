import { Program, checkPackageOutdated } from '@boost/cli';
// eslint-disable-next-line unicorn/import-index
import { BuildCommand } from './index';

const version = String(require('../package.json').version);

process.env.NODE_ENV = 'production';

async function run() {
  const program = new Program({
    bin: 'packemon',
    footer: 'Documentation: https://packemon.dev',
    name: 'Packemon',
    version,
  });

  program.middleware(checkPackageOutdated('packemon', version)).register(new BuildCommand());

  await program.runAndExit(process.argv);
}

void run();
