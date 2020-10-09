import React, { useEffect, useState } from 'react';
import { Box, useStdout } from 'ink';
import Spinner from 'ink-spinner';
import { formatMs } from '@boost/common';
import { Style, StyleType } from '@boost/cli';
import { screen } from '@boost/terminal';
import Build from '../Build';
import { BuildStatus } from '../types';
import TargetPlatforms from './TargetPlatforms';

const STATUS_COLORS: { [K in BuildStatus]: StyleType } = {
  pending: 'muted',
  building: 'default',
  passed: 'success',
  failed: 'failure',
  skipped: 'warning',
};

export interface BuildRowProps {
  build: Build;
}

export function BuildRow({ build }: BuildRowProps) {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row">
        <Box>
          <Style bold type="default">
            {build.name}
          </Style>
        </Box>

        {build.formats.map((format) => (
          <Box key={format} marginLeft={1}>
            <Style bold inverted type={STATUS_COLORS[build.status]}>
              {` ${format.toUpperCase()} `}
            </Style>
          </Box>
        ))}

        {build.status === 'building' && (
          <Box marginLeft={1}>
            <Style type="success">
              <Spinner type="dots" />
            </Style>
          </Box>
        )}

        {build.result && build.result.time > 0 && (
          <Box marginLeft={1}>
            <Style type="muted">{formatMs(build.result.time)}</Style>
          </Box>
        )}
      </Box>

      <Box>
        <TargetPlatforms platforms={build.platforms} target={build.target} />
      </Box>
    </Box>
  );
}

const ROW_HEIGHT = 3; // 2 rows + 1 top margin

export interface BuildListProps {
  builds: Build[];
}

export default function BuildList({ builds }: BuildListProps) {
  const [height, setHeight] = useState(screen.size().rows);
  const { stdout } = useStdout();

  useEffect(() => {
    const handler = () => {
      setHeight(screen.size().rows);
    };

    stdout?.on('resize', handler);

    return () => {
      stdout?.off('resize', handler);
    };
  }, [stdout]);

  // We dont want to show more builds than the amount of rows available in the terminal
  const visibleBuilds = builds.slice(0, Math.floor(height / ROW_HEIGHT) - 1);

  return (
    <>
      {visibleBuilds.map((build) => (
        <BuildRow key={build.name} build={build} />
      ))}
    </>
  );
}
