import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { Header, useProgram } from '@boost/cli';
import PackageValidator from '../PackageValidator';
import ValidateRow from './ValidateRow';
import { ValidateOptions } from '../types';
import useRenderLoop from './hooks/useRenderLoop';
import Packemon from '../Packemon';

export interface ValidateProps extends Partial<ValidateOptions> {
  packemon: Packemon;
  onValidated?: () => void;
}

export default function Validate({ packemon, onValidated, ...options }: ValidateProps) {
  const { exit } = useProgram();
  const clearLoop = useRenderLoop();
  const [isValidating, setIsValidating] = useState(true);
  const [failedValidators, setFailedValidators] = useState<PackageValidator[]>([]);

  // Run the validate process on mount
  useEffect(() => {
    void packemon
      .validate(options)
      .then((validators) => {
        setIsValidating(false);
        setFailedValidators(
          validators.filter((validator) => validator.hasErrors() || validator.hasWarnings()),
        );
        onValidated?.();
      })
      .catch(exit)
      .finally(clearLoop);

    return clearLoop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Exit validation if there are any errors
  useEffect(() => {
    const errorCount = failedValidators.filter((validator) => validator.hasErrors()).length;
    const errorMessage =
      errorCount === 1
        ? `Found errors in ${failedValidators[0].package.getName()} package!`
        : `Found errors in ${errorCount} packages!`;

    if (errorCount > 0) {
      exit(`Validation failed. ${errorMessage}`);
    }
  }, [failedValidators, exit]);

  return (
    <Box flexDirection="column" margin={0}>
      {(isValidating || failedValidators.length > 0) && (
        <Header label="Validating packages" marginBottom={0} />
      )}

      {failedValidators.map((validator, i) => (
        <ValidateRow key={`validate-${validator.package.getName()}`} validator={validator} />
      ))}
    </Box>
  );
}
