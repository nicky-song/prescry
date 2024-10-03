// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { PendingPrescriptionsListDefinition } from './pending-prescriptions-list';

describe('PendingPrescriptionsListDefinition()', () => {
  it('creates instance of SchemaDefinition<IPendingPrescriptionsList>', () => {
    const pendingPrescriptionSchema = {} as Schema;
    const telemetryIdsSchema = {} as Schema;

    const result = PendingPrescriptionsListDefinition(
      pendingPrescriptionSchema,
      telemetryIdsSchema
    );
    expect(result).toMatchObject({
      events: { required: false, type: telemetryIdsSchema },
      identifier: { required: true, type: String },
      prescriptions: { required: false, type: [pendingPrescriptionSchema] },
    });
  });
});
