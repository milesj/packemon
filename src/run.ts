import { Program } from '@boost/cli';
import DistributeCommand from './commands/Distribute';

export async function run() {
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
