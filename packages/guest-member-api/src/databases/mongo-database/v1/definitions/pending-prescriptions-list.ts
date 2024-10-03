// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IPendingPrescriptionsList } from '@phx/common/src/models/pending-prescription';

export const PendingPrescriptionsListDefinition = (
  pendingPrescription: Schema,
  telemetryIdsSchema: Schema
): SchemaDefinition<IPendingPrescriptionsList> => ({
  events: { required: false, type: [telemetryIdsSchema] },
  identifier: { required: true, type: String },
  prescriptions: { required: false, type: [pendingPrescription] },
});
