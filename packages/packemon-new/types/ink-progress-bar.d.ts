declare module 'ink-progress-bar' {
  import type { FC } from 'react';

  interface Props {
    character?: string;
    percent: number;
    left?: number;
    right?: number;
  }

  const ProgressBar: FC<Props>;

  export default ProgressBar;
}
