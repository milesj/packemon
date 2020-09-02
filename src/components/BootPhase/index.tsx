import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import ProgressBar from 'ink-progress-bar';
import { Header } from '@boost/cli';
import Packemon from '../../Packemon';
import { Build } from '../../types';

const DELAY_PHASE = 100;

export interface BootPhaseProps {
  packemon: Packemon;
  onBooted: (builds: Build[]) => void;
}

export default function BootPhase({ packemon, onBooted }: BootPhaseProps) {
  const [progress, setProgress] = useState(0);

  // Find all packages and generate builds on mount
  useEffect(() => {
    void packemon.boot().then((builds) => {
      // Delay next phase to show progress bar
      setTimeout(() => {
        onBooted(builds);
      }, DELAY_PHASE);
    });
  }, [packemon, onBooted]);

  // Monitor generation progress
  useEffect(() => {
    const handleProgress = (current: number, total: number) => {
      setProgress(current / total);
    };

    packemon.onBootProgress.listen(handleProgress);

    return () => {
      packemon.onBootProgress.unlisten(handleProgress);
    };
  }, [packemon]);

  return (
    <Box flexDirection="column">
      <Header label="Bootstrapping packages and generating build requests" />
      <ProgressBar percent={progress} />
    </Box>
  );
}
