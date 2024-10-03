// Copyright 2020 Prescryptive Health, Inc.

import { CouponDetailsLogoDefinition } from './coupon-details-logo.definition';

describe('CouponDetailsLogoDefinition()', () => {
  it('creates instance of SchemaDefinition<ICouponLogo>', () => {
    const result = CouponDetailsLogoDefinition();
    expect(result).toMatchObject({
      name: { type: String, required: true },
      alternativeText: { type: String, required: true },
      caption: { type: String, required: true },
      hash: { type: String, required: true },
      ext: { type: String, required: true },
      mime: { type: String, required: true },
      size: { type: Number, required: true },
      url: { type: String, required: true },
      provider: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      id: { type: String, required: true },
    });
  });
});
