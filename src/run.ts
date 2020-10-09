import { Program } from '@boost/cli';
import Command from './Command';

export async function run() {
  const program = new Program({
    bin: 'packemon',
    footer: 'Documentation: https://packemon.dev',
    name: 'Packemon',
    // eslint-disable-next-line
    version: require('../package.json').version,
  });

  program
    .categories({
      browser: 'Browser',
      global: 'Global',
      node: 'Node',
    })
    .default(new Command());

  await program.runAndExit(process.argv);
}
