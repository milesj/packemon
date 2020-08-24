import React from 'react';
import { Box } from 'ink';
import { Style, StyleType } from '@boost/cli';
import { Build, Platform, BuildStatus, Target } from '../types';

const PLATFORMS: { [K in Platform]: string } = {
  node: 'Node',
  browser: 'Browser',
};

const TARGETS: { [K in Target]: string } = {
  legacy: 'Legacy',
  modern: 'Modern',
  future: 'Future',
};

const STATUS_COLORS: { [K in BuildStatus]: StyleType } = {
  pending: 'muted',
  building: 'default',
  passed: 'success',
  failed: 'failure',
};

export interface BuildsProps {
  builds: Build[];
}

export default function BuildList({ builds }: BuildsProps) {
  return (
    <>
      {builds.map((build) => (
        <Box key={build.package.name} flexDirection="column" marginBottom={1}>
          <Box flexDirection="row">
            <Box>
              <Style bold type="default">
                {build.package.name}
              </Style>
            </Box>

            {build.formats.map((format) => (
              <Box key={format} flexGrow={0} flexShrink={0} marginLeft={1}>
                <Style bold inverted type={STATUS_COLORS[build.status]}>
                  {` ${format.toUpperCase()} `}
                </Style>
              </Box>
            ))}
          </Box>

          <Box>
            <Style type="muted">
              {TARGETS[build.target]}
              {' / '}
              {build.platforms.map((platform) => PLATFORMS[platform]).join(' | ')}
            </Style>
          </Box>
        </Box>
      ))}
    </>
  );
}
