import React from 'react';
import { Box } from 'ink';
import Spinner from 'ink-spinner';
import { formatMs } from '@boost/common';
import { Style, StyleType } from '@boost/cli';
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
            {build.package.name}
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

export interface BuildListProps {
  builds: Build[];
}

export default function BuildList({ builds }: BuildListProps) {
  return (
    <>
      {builds.map((build) => (
        <BuildRow key={build.package.name} build={build} />
      ))}
    </>
  );
}
