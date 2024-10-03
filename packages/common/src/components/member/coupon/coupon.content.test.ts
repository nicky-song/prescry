// Copyright 2021 Prescryptive Health, Inc.

import { ICouponContentProps, CouponContent } from './coupon.content';

describe('CouponContent', () => {
  it('has expected content', () => {
    const expectedContent: ICouponContentProps = {
      groupNumberLabel: 'Group number',
      pcnLabel: 'PCN',
      memberIdLabel: 'Member ID',
      binLabel: 'BIN',
      payAsLittle: 'Pay as little as',
    };
    expect(CouponContent).toEqual(expectedContent);
  });
});
