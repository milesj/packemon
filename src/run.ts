import { Program } from '@boost/cli';
import Command from './Command';
import pkg from '../package.json';

export async function run() {
  const program = new Program({
    bin: 'packemon',
    footer: 'Documentation: https://packemon.dev',
    name: 'Packemon',
    version: pkg.version,
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
