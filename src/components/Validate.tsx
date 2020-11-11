import React from 'react';
import { Static } from 'ink';
import { Failure } from '@boost/cli';
import PackageValidator from '../PackageValidator';
import ValidateRow from './ValidateRow';

export interface ValidateProps {
  validators: PackageValidator[];
}

export default function Validate({ validators }: ValidateProps) {
  const failedValidators = validators.filter(
    (validator) => validator.errors.length > 0 || validator.warnings.length > 0,
  );

  if (failedValidators.length === 0) {
    return null;
  }

  const errorCount = failedValidators.filter((validator) => validator.errors.length > 0).length;
  const errorMessage =
    errorCount === 1 ? 'Found errors in 1 package!' : `Found errors in ${errorCount} packages!`;

  return (
    <>
      <Static items={failedValidators}>
        {(validator) => <ValidateRow key={validator.contents.name} validator={validator} />}
      </Static>

      {errorCount > 0 && <Failure error={new Error(`Validation failed. ${errorMessage}`)} />}
    </>
  );
}
