// Copyright 2021 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { getCouponIfEligible } from './get-coupon-if-eligible';
import {
  isPharmacyFeatured,
  isPharmacyInCouponNetwork,
} from './build-pharmacy-response';
import { getCouponByNdcAndQuantity } from '../../../utils/external-api/get-coupon-by-ndc-and-quantity';
import { ICoupon } from '../../../models/coupon';

jest.mock('./build-pharmacy-response');
jest.mock('../../../utils/external-api/get-coupon-by-ndc-and-quantity');

const isPharmacyFeaturedMock = isPharmacyFeatured as jest.Mock;
const isPharmacyInCouponNetworkMock = isPharmacyInCouponNetwork as jest.Mock;
const getCouponByNdcAndQuantityMock = getCouponByNdcAndQuantity as jest.Mock;

const couponInfoMock = {
  ProductId: '1234',
  GroupNumber: '2468',
  PCN: '12345',
  MemberId: '6789',
  BIN: '1357',
} as ICoupon;

describe('getCouponIfEligibleHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return undefined if isSmartPriceEligible is set to false', async () => {
    // Arrange
    const isSmartPriceEligible = false;
    const ndc = '13913000519';
    const quantity = 90;
    const ncpdp = '0527549';
    isPharmacyFeaturedMock.mockReturnValue(true);
    isPharmacyInCouponNetworkMock.mockReturnValue(true);
    getCouponByNdcAndQuantityMock.mockReturnValue({
      coupon: couponInfoMock,
    });

    // Act
    const result = await getCouponIfEligible(
      configurationMock,
      isSmartPriceEligible,
      ndc,
      quantity,
      ncpdp
    );

    // Assert
    expect(getCouponByNdcAndQuantityMock).not.toHaveBeenCalled();
    expect(result).toEqual(undefined);
  });

  it('Should return undefined if NDC is set to undefined', async () => {
    // Arrange
    const isSmartPriceEligible = true;
    const ndc = undefined;
    const quantity = 90;
    const ncpdp = '0527549';
    isPharmacyFeaturedMock.mockReturnValue(true);
    isPharmacyInCouponNetworkMock.mockReturnValue(true);
    getCouponByNdcAndQuantityMock.mockReturnValue({
      coupon: couponInfoMock,
    });

    // Act
    const result = await getCouponIfEligible(
      configurationMock,
      isSmartPriceEligible,
      ndc,
      quantity,
      ncpdp
    );

    // Assert
    expect(getCouponByNdcAndQuantityMock).not.toHaveBeenCalled();
    expect(result).toEqual(undefined);
  });

  it('Should return undefined if quantity is set to undefined', async () => {
    // Arrange
    const isSmartPriceEligible = true;
    const ndc = '13913000519';
    const quantity = undefined;
    const ncpdp = '0527549';
    isPharmacyFeaturedMock.mockReturnValue(true);
    isPharmacyInCouponNetworkMock.mockReturnValue(true);
    getCouponByNdcAndQuantityMock.mockReturnValue({
      coupon: couponInfoMock,
    });

    // Act
    const result = await getCouponIfEligible(
      configurationMock,
      isSmartPriceEligible,
      ndc,
      quantity,
      ncpdp
    );

    // Assert
    expect(getCouponByNdcAndQuantityMock).not.toHaveBeenCalled();
    expect(result).toEqual(undefined);
  });

  it('Should return undefined if NCPDP is set to undefined', async () => {
    // Arrange
    const isSmartPriceEligible = true;
    const ndc = '13913000519';
    const quantity = 90;
    const ncpdp = undefined;
    isPharmacyFeaturedMock.mockReturnValue(true);
    isPharmacyInCouponNetworkMock.mockReturnValue(true);
    getCouponByNdcAndQuantityMock.mockReturnValue({
      coupon: couponInfoMock,
    });

    // Act
    const result = await getCouponIfEligible(
      configurationMock,
      isSmartPriceEligible,
      ndc,
      quantity,
      ncpdp
    );

    // Assert
    expect(getCouponByNdcAndQuantityMock).not.toHaveBeenCalled();
    expect(result).toEqual(undefined);
  });

  it('Should return undefined if pharmacy is not featured and is not in coupon network', async () => {
    // Arrange
    const isSmartPriceEligible = true;
    const ndc = '13913000519';
    const quantity = 90;
    const ncpdp = '0527549';
    isPharmacyFeaturedMock.mockReturnValue(false);
    isPharmacyInCouponNetworkMock.mockReturnValue(false);
    getCouponByNdcAndQuantityMock.mockReturnValue({
      coupon: couponInfoMock,
    });

    // Act
    const result = await getCouponIfEligible(
      configurationMock,
      isSmartPriceEligible,
      ndc,
      quantity,
      ncpdp
    );

    // Assert
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndc,
      quantity,
      configurationMock
    );
    expect(result).toEqual(undefined);
  });

  it('Should return undefined if coupon is not found for the drug', async () => {
    // Arrange
    const isSmartPriceEligible = true;
    const ndc = '13913000519';
    const quantity = 90;
    const ncpdp = '0527549';
    isPharmacyFeaturedMock.mockReturnValue(true);
    isPharmacyInCouponNetworkMock.mockReturnValue(true);
    getCouponByNdcAndQuantityMock.mockReturnValue({
      coupon: {},
    });

    // Act
    const result = await getCouponIfEligible(
      configurationMock,
      isSmartPriceEligible,
      ndc,
      quantity,
      ncpdp
    );

    // Assert
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndc,
      quantity,
      configurationMock
    );
    expect(result).toEqual(undefined);
  });

  it('Should return coupon if pharmacy is featured but is not in coupon network', async () => {
    // Arrange
    const isSmartPriceEligible = true;
    const ndc = '13913000519';
    const quantity = 90;
    const ncpdp = '0527549';
    isPharmacyFeaturedMock.mockReturnValue(true);
    isPharmacyInCouponNetworkMock.mockReturnValue(false);
    getCouponByNdcAndQuantityMock.mockReturnValue({
      coupon: couponInfoMock,
    });

    // Act
    const result = await getCouponIfEligible(
      configurationMock,
      isSmartPriceEligible,
      ndc,
      quantity,
      ncpdp
    );

    // Assert
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndc,
      quantity,
      configurationMock
    );
    expect(result).toEqual(couponInfoMock);
  });

  it('Should return coupon if pharmacy is not featured but it is in coupon network', async () => {
    // Arrange
    const isSmartPriceEligible = true;
    const ndc = '13913000519';
    const quantity = 90;
    const ncpdp = '0527549';
    isPharmacyFeaturedMock.mockReturnValue(false);
    isPharmacyInCouponNetworkMock.mockReturnValue(true);
    getCouponByNdcAndQuantityMock.mockReturnValue({
      coupon: couponInfoMock,
    });

    // Act
    const result = await getCouponIfEligible(
      configurationMock,
      isSmartPriceEligible,
      ndc,
      quantity,
      ncpdp
    );

    // Assert
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndc,
      quantity,
      configurationMock
    );
    expect(result).toEqual(couponInfoMock);
  });
});
