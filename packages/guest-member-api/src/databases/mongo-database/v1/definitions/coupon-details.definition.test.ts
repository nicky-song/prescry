// Copyright 2020 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { CouponDetailsDefinition } from './coupon-details.definition';

describe('CouponDetailsDefinition()', () => {
  it('creates instance of SchemaDefinition<ICouponDetails>', () => {
    const couponDetailsLogoSchema = {} as Schema;
    const result = CouponDetailsDefinition(couponDetailsLogoSchema);
    expect(result).toMatchObject({
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
  });
});
