// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import {
  isPharmacyFeatured,
  isPharmacyInCouponNetwork,
} from './build-pharmacy-response';
import {
  ICouponResponse,
  getCouponByNdcAndQuantity,
} from '../../../utils/external-api/get-coupon-by-ndc-and-quantity';

export async function getCouponIfEligible(
  configuration: IConfiguration,
  isSmartPriceEligible: boolean,
  ndc: string | undefined,
  quantity: number | undefined,
  ncpdp: string | undefined
) {
  if (isSmartPriceEligible && ndc && quantity && ncpdp) {
    const couponApiResponse: ICouponResponse = await getCouponByNdcAndQuantity(
      ndc,
      quantity,
      configuration
    );
    const { coupon } = couponApiResponse;
    if (
      !!coupon?.ProductId &&
      (isPharmacyFeatured(ncpdp, coupon) ||
        isPharmacyInCouponNetwork(ncpdp, coupon))
    ) {
      return coupon;
    }
  }
  return undefined;
}
