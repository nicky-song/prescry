// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { PrescriptionDefinition } from './prescription';

describe('PrescriptionDefinition()', () => {
  it('creates instance of SchemaDefinition<IPharmacyOffer>', () => {
    const contactInfoSchema = {} as Schema;
    const fillOptionsSchema = {} as Schema;

    const result = PrescriptionDefinition(contactInfoSchema, fillOptionsSchema);
    expect(result).toMatchObject({
      expiresOn: { required: true, type: Date },
      fillOptions: [{ type: fillOptionsSchema, required: true }],
      isNewPrescription: { required: false, type: Boolean },
      isPriorAuthRequired: { required: false, type: Boolean },
      lastFilledOn: { required: false, type: Date },
      prescribedOn: { required: true, type: Date },
      prescriber: { required: true, type: contactInfoSchema },
      referenceNumber: { required: true, type: String },
      sig: { required: true, type: String },
    });
  });
});
