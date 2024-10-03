// Copyright 2022 Prescryptive Health, Inc.

import { ICoverage } from '../models/fhir/patient-coverage/coverage';

export const getMasterIdFromCoverage = (
  coverage: ICoverage
): string | undefined => {
  const beneficiary = coverage.beneficiary;

  if (!beneficiary) {
    return undefined;
  }

  const reference = beneficiary.reference;

  if (!reference) {
    return undefined;
  }

  const parts = reference.split('/');
  const masterId = parts[parts.length - 1];

  if (!masterId) {
    return undefined;
  }

  return masterId;
};
