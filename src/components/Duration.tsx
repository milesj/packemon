import React from 'react';
import { Style } from '@boost/cli';
import { formatMs } from '@boost/common';

export interface DurationProps {
  time: number;
}

export default function Duration({ time }: DurationProps) {
  const isFast = time <= 100;

  return (
    <Style type={isFast ? 'muted' : 'default'} bold>
      {isFast ? '↝' : formatMs(time)}
    </Style>
  );
}
