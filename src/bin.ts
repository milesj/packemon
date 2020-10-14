import { Program } from '@boost/cli';
// eslint-disable-next-line unicorn/import-index
import { DistributeCommand } from './index';

async function run() {
  const program = new Program({
    bin: 'packemon',
    footer: 'Documentation: https://packemon.dev',
    name: 'Packemon',
    // eslint-disable-next-line
    version: require('../package.json').version,
  });

  program.register(new DistributeCommand());

  await program.runAndExit(process.argv);
}

void run();
