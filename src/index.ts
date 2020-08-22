/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Program } from '@boost/cli';
import pkg from '../package.json';

const program = new Program({
  bin: 'packemon',
  footer: 'Documentation: https://packemon.dev',
  name: 'Packemon',
  version: pkg.version,
});
