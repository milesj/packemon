import { Arg, Command, GlobalOptions, PrimitiveType } from '@boost/cli';
import { Memoize } from '@boost/common';
import Packemon from '../Packemon';

export default abstract class BaseCommand<
  O extends object = {},
  P extends PrimitiveType[] = string[]
> extends Command<O & GlobalOptions & { cwd: string }, P> {
  @Arg.String('Current working directory to run in', { category: 'global' })
  cwd: string = '';

  @Memoize()
  protected get packemon() {
    return new Packemon(this.cwd || process.cwd());
  }
}
