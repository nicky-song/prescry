// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { ICouponDetails } from '@phx/common/src/models/coupon-details/coupon-details';

export const CouponDetailsDefinition = (
  couponDetailsLogoSchema: Schema
): SchemaDefinition<ICouponDetails> => ({
  productManufacturerName: { type: String, required: true },
  price: { type: Number, required: true },
  ageLimit: { type: Number, required: true },
  introductionDialog: { type: String, required: true },
  eligibilityURL: { type: String, required: true },
  copayText: { type: String, required: true },
  copayAmount: { type: Number, required: true },
  groupNumber: { type: String, required: true },
  pcn: { type: String, required: true },
  memberId: { type: String, required: true },
  bin: { type: String, required: true },
  featuredPharmacy: { type: String, required: true },
  logo: { type: couponDetailsLogoSchema, required: true },
});
