// Copyright 2018 Prescryptive Health, Inc.

import { IPatient } from '@phx/common/src/models/patient';
import { SchemaDefinition } from 'mongoose';

export const PatientDefinition = (): SchemaDefinition<IPatient> => ({
  email: { type: String, required: true },
  patientId: { type: String, required: true },
});
