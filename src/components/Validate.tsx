import React, { useEffect } from 'react';
import { Box } from 'ink';
import { useProgram } from '@boost/cli';
import PackageValidator from '../PackageValidator';
import ValidateRow from './ValidateRow';

export interface ValidateProps {
  validators: PackageValidator[];
}

export default function Validate({ validators }: ValidateProps) {
  const { exit } = useProgram();
  const failedValidators = validators.filter(
    (validator) => validator.hasErrors() || validator.hasWarnings(),
  );
  const errorCount = failedValidators.filter((validator) => validator.hasErrors()).length;
  const errorMessage =
    errorCount === 1
      ? `Found errors in ${failedValidators[0].contents.name} package!`
      : `Found errors in ${errorCount} packages!`;

  useEffect(() => {
    if (errorCount > 0) {
      exit(`Validation failed. ${errorMessage}`);
    }
  }, [errorCount, errorMessage, exit]);

  if (failedValidators.length === 0) {
    return null;
  }

  return (
    <>
      {failedValidators.map((validator, i) => (
        <React.Fragment key={validator.contents.name}>
          {i > 0 && <Box marginTop={1} />}
          <ValidateRow validator={validator} />
        </React.Fragment>
      ))}
    </>
  );
}
