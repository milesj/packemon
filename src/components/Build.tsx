import React from 'react';
import { Box } from 'ink';
import { Style } from '@boost/cli';
import { figures } from '@boost/terminal';
import { STATE_COLORS } from '../constants';
import { ArtifactState } from '../types';

export interface BuildProps {
  build: string;
  children?: React.ReactNode;
  state?: ArtifactState;
}

export default function Build({ build, children, state = 'pending' }: BuildProps) {
  return (
    <Box marginLeft={1}>
      <Style bold type={STATE_COLORS[state] || 'default'}>
        {state === 'failed' ? figures.cross : figures.squareSmallFilled} {build.toLowerCase()}
      </Style>

      {children}
    </Box>
  );
}
