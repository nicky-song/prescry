// Copyright 2020 Prescryptive Health, Inc.

import { PatientTestResultDefinition } from './patient-test-result.defintion';

describe('PatientTestResultDefinition()', () => {
  it('creates instance of SchemaDefinition<IPatientTestResult>', () => {
    const result = PatientTestResultDefinition();
    expect(result).toMatchObject({
      icd10: [{ type: String, required: true }],
      provider: { type: String, required: true },
      fillDate: { type: Date, required: true },
      productOrService: { type: String, required: true },
      primaryMemberRxId: { type: String, required: true },
      orderNumber: { type: String, required: true },
      claimOptionId: { type: String, required: false },
    });
  });
});
