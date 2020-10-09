import React, { useEffect } from 'react';
import { Box } from 'ink';
import { Header } from '@boost/cli';
import Packemon from '../Packemon';

export interface PackPhaseProps {
  packemon: Packemon;
  onPacked: () => void;
}

export default function PackPhase({ packemon, onPacked }: PackPhaseProps) {
  // Start packing packages on mount
  useEffect(() => {
    void packemon.pack().then(() => {
      onPacked();
    });
  }, [packemon, onPacked]);

  return (
    <Box flexDirection="column">
      <Header label="Packing packages for distribution" />
    </Box>
  );
}
