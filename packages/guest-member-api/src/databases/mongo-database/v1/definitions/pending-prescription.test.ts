// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { PendingPrescriptionDefinition } from './pending-prescription';

describe('PendingPrescriptionDefinition()', () => {
  it('creates instance of SchemaDefinition<IPendingPrescription>', () => {
    const contactInfoSchema = {} as Schema;
    const medicationSchema = {} as Schema;
    const pharmacyOfferSchema = {} as Schema;
    const prescriptionSchema = {} as Schema;
    const recommendationSchema = {} as Schema;

    const result = PendingPrescriptionDefinition(
      medicationSchema,
      pharmacyOfferSchema,
      contactInfoSchema,
      prescriptionSchema,
      recommendationSchema
    );
    expect(result).toMatchObject({
      alternatives: { required: false, type: [medicationSchema] },
      confirmation: {
        required: false,
        type: { offerId: String, orderNumber: String, orderDate: Date },
      },
      identifier: { required: true, type: String },
      medication: { required: true, type: medicationSchema },
      offers: [{ required: true, type: pharmacyOfferSchema }],
      pharmacies: [{ required: true, type: contactInfoSchema }],
      prescription: { required: true, type: prescriptionSchema },
      recommendations: { required: false, type: [recommendationSchema] },
      shouldPushAlternative: { required: false, type: Boolean },
    });
  });
});
