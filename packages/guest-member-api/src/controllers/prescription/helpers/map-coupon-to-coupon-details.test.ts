// Copyright 2021 Prescryptive Health, Inc.

import { couponMock } from '../../../mock-data/coupon.mock';
import { mapCouponToCouponDetails } from '../../../controllers/prescription/helpers/map-coupon-to-coupon-details';
import { ICoupon } from '../../../models/coupon';

describe('mapCouponToCouponDetailsHelper', () => {
  const emptyString = '';
  const zeroValue = 0;
  const emptyObject = {};
  const numberOfKeys = 13;

  it('Should map the values correctly when passing in a valid coupon object', () => {
    // Act
    const result = mapCouponToCouponDetails(couponMock);

    // Assert
    expect(result.productManufacturerName).toEqual(
      couponMock.ProductManufacturerName
    );
    expect(result.price).toEqual(couponMock.MaxPrice);
    expect(result.ageLimit).toEqual(couponMock.AgeLimit);
    expect(result.introductionDialog).toEqual(couponMock.IntroductionDialog);
    expect(result.eligibilityURL).toEqual(couponMock.EligibilityURL);
    expect(result.copayText).toEqual(couponMock.CopayText);
    expect(result.copayAmount).toEqual(couponMock.CopayAmount);
    expect(result.groupNumber).toEqual(couponMock.GroupNumber);
    expect(result.pcn).toEqual(couponMock.PCN);
    expect(result.memberId).toEqual(couponMock.MemberId);
    expect(result.bin).toEqual(couponMock.BIN);
    expect(result.featuredPharmacy).toEqual(
      couponMock.FeaturedCouponProvider?.NCPDP
    );
    expect(result.logo).toEqual(couponMock.Logo);
    expect(Object.keys(result).length).toEqual(numberOfKeys);
  });

  it('Should map the values correctly when passing in an empty object for the coupon', () => {
    // Act
    const result = mapCouponToCouponDetails({} as ICoupon);

    // Assert
    expect(result.productManufacturerName).toEqual(emptyString);
    expect(result.price).toEqual(zeroValue);
    expect(result.ageLimit).toEqual(zeroValue);
    expect(result.introductionDialog).toEqual(emptyString);
    expect(result.eligibilityURL).toEqual(emptyString);
    expect(result.copayText).toEqual(emptyString);
    expect(result.copayAmount).toEqual(zeroValue);
    expect(result.groupNumber).toEqual(emptyString);
    expect(result.pcn).toEqual(emptyString);
    expect(result.memberId).toEqual(emptyString);
    expect(result.bin).toEqual(emptyString);
    expect(result.featuredPharmacy).toEqual(emptyString);
    expect(result.logo).toEqual(emptyObject);
    expect(Object.keys(result).length).toEqual(numberOfKeys);
  });
});
