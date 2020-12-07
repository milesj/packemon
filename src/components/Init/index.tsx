import React, { useCallback, useState } from 'react';
import { Box, Text } from 'ink';
import { Header, Style } from '@boost/cli';
import PackageForm from './PackageForm';
import { PackemonPackageConfig } from '../../types';

export type InitPackageConfigs = Record<string, PackemonPackageConfig>;

export interface InitProps {
  packageNames: string[];
  onComplete: (configs: InitPackageConfigs) => void;
}

export default function Init({ packageNames }: InitProps) {
  const [pkgsToConfigure, setPkgsToConfigure] = useState(() => packageNames);
  const [pkgConfigs, setPkgConfigs] = useState<InitPackageConfigs>({});
  const currentPkg = pkgsToConfigure[0];

  const handleSubmit = useCallback(
    (config: PackemonPackageConfig) => {
      console.log(currentPkg, config);

      setPkgConfigs((prev) => ({
        ...prev,
        [currentPkg]: config,
      }));

      setPkgsToConfigure((prev) => prev.slice(1));
    },
    [currentPkg],
  );

  if (pkgsToConfigure.length === 0) {
    return null;
  }

  return (
    <Box flexDirection="column">
      <Header label="Initializing packages" />

      <Box>
        <Text>
          <Text bold>Packages to configure: </Text>
          <Style type="notice">{currentPkg}</Style>
          {pkgsToConfigure.length > 1 && `, ${pkgsToConfigure.slice(1).join(', ')}`}
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <PackageForm onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
}
