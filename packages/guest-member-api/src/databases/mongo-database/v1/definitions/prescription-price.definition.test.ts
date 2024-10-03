// Copyright 2021 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { PrescriptionPriceDefinition } from './prescription-price.definition';
import { CouponDetailsDefinition } from './coupon-details.definition';
import { CouponDetailsLogoDefinition } from './coupon-details-logo.definition';

describe('PrescriptionPriceDefinition()', () => {
  it('creates instance of SchemaDefinition<IPrescriptionPrice>', () => {
    const CouponDetailsLogoDefinitionSchema = new Schema(
      CouponDetailsLogoDefinition()
    );
    const CouponDetailsSchema = new Schema(
      CouponDetailsDefinition(CouponDetailsLogoDefinitionSchema)
    );
    const result = PrescriptionPriceDefinition(CouponDetailsSchema);
    expect(result).toMatchObject({
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
      coupon: { type: CouponDetailsSchema, required: false },
    });
  });
});
