import { Arg, Command, GlobalOptions, PrimitiveType } from '@boost/cli';
import { Memoize } from '@boost/common';
import { Packemon } from '../Packemon';

export interface CommonOptions {
  cwd: string;
  skipPrivate: boolean;
}

export abstract class BaseCommand<
  O extends object = {},
  P extends PrimitiveType[] = string[]
> extends Command<CommonOptions & GlobalOptions & O, P> {
  @Arg.String('Current working directory to run in', { category: 'global' })
  cwd: string = '';

  @Arg.Flag('Skip `private` packages', { category: 'global' })
  skipPrivate: boolean = false;

  @Memoize()
  protected get packemon() {
    return new Packemon(this.cwd || process.cwd());
  }
}
