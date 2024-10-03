// Copyright 2023 Prescryptive Health, Inc.

import { ErrorNewDependentPrescription } from './error-caregiver-new-dependent-prescription';

describe('ErrorNewDependentPrescription', () => {
  it('should create instance of ErrorNewDependentPrescription', () => {
    const error = new ErrorNewDependentPrescription('fake-error');
    expect(error).toBeInstanceOf(ErrorNewDependentPrescription);
    expect(error).toEqual(new Error('fake-error'));
  });
});
