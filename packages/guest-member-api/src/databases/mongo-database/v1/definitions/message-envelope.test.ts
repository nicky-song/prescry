// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { MessageEnvelopeDefinition } from './message-envelope';

describe('MessageEnvelopeDefinition()', () => {
  it('creates instance of SchemaDefinition<IMessageEnvelope>', () => {
    const pendingPrescriptionListSchema = {} as Schema;
    const result = MessageEnvelopeDefinition(pendingPrescriptionListSchema);
    expect(result).toMatchObject({
      identifier: { type: String, required: true },
      pendingPrescriptionList: {
        required: true,
        type: pendingPrescriptionListSchema,
      },
    });
  });
});
