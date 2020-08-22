import { Program } from '@boost/cli';
import Command from './Command';
import pkg from '../package.json';

const program = new Program({
  bin: 'packemon',
  footer: 'Documentation: https://packemon.dev',
  name: 'Packemon',
  version: pkg.version,
});

void program
  .categories({
    browser: 'Browser',
    node: 'Node',
  })
  .default(new Command())
  .runAndExit(process.argv);
