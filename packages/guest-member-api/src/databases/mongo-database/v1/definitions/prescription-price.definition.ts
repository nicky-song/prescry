// Copyright 2020 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IPrescriptionPrice } from '../../../../models/prescription-price-event';

export const PrescriptionPriceDefinition = (
  couponDetailsSchema: Schema
): SchemaDefinition<IPrescriptionPrice> => ({
  prescriptionId: { type: String, required: true },
  memberId: { type: String, required: true },
  daysSupply: { type: Number, required: true },
  pharmacyId: { type: String, required: true },
  fillDate: { type: String, required: true },
  ndc: { type: String, required: true },
  planPays: { type: Number, required: false },
  memberPays: { type: Number, required: false },
  pharmacyTotalPrice: { type: Number, required: false },
  quantity: { type: Number, required: true },
  type: { type: String, required: true },
  coupon: { type: couponDetailsSchema, required: false },
});
