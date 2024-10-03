// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IPendingPrescription } from '@phx/common/src/models/pending-prescription';

export const PendingPrescriptionDefinition = (
  contactInfo: Schema,
  medication: Schema,
  pharmacyOffer: Schema,
  prescription: Schema,
  recommendation: Schema
): SchemaDefinition<IPendingPrescription> => ({
  alternatives: { required: false, type: [medication] },
  bestPrice: { required: true, type: String },
  confirmation: {
    required: false,
    type: { offerId: String, orderNumber: String, orderDate: Date },
  },
  identifier: { required: true, type: String },
  medication: { required: true, type: medication },
  medicationId: { required: true, type: String },
  offers: [{ required: true, type: pharmacyOffer }],
  personId: { required: false, type: String },
  pharmacies: [{ required: true, type: contactInfo }],
  prescription: { required: true, type: prescription },
  recommendations: { required: false, type: [recommendation] },
  shouldPushAlternative: { required: false, type: Boolean },
});
