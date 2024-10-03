// Copyright 2018 Prescryptive Health, Inc.

import { IMedication } from '@phx/common/src/models/medication';
import { SchemaDefinition } from 'mongoose';

export const MedicationDefinition = (): SchemaDefinition<IMedication> => ({
  form: { type: String, required: true },
  genericName: { type: String, required: true },
  genericProductId: { type: String, required: true },
  isGeneric: { type: Boolean, required: false },
  medicationId: { type: String, required: true },
  name: { type: String, required: true },
  strength: { type: String, required: true },
  units: { type: String, required: true },
});
