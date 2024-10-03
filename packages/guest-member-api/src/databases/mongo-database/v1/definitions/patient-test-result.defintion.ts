// Copyright 2018 Prescryptive Health, Inc.

import { IPatientTestResult } from '../../../../models/patient-test-result';
import { SchemaDefinition } from 'mongoose';

export const PatientTestResultDefinition =
  (): SchemaDefinition<IPatientTestResult> => ({
    icd10: [{ type: String, required: true }],
    provider: { type: String, required: true },
    fillDate: { type: Date, required: true },
    productOrService: { type: String, required: true },
    primaryMemberRxId: { type: String, required: true },
    orderNumber: { type: String, required: true },
    claimOptionId: { type: String, required: false },
  });
