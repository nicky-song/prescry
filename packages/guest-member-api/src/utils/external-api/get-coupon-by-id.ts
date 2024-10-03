// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { getDataFromUrl } from '../get-data-from-url';
import { IPlatformApiError } from '../../models/platform/platform-api-error.response';
import { ICoupon } from '../../models/coupon';
import { defaultRetryPolicy } from '../fetch-retry.helper';

export interface ICouponResponse {
  coupon?: ICoupon;
  errorCode?: number;
  message?: string;
}

export async function getCouponById(
  couponId: string,
  configuration: IConfiguration
): Promise<ICouponResponse> {
  const apiResponse = await getDataFromUrl(
    buildCouponLookupUrl(configuration.contentApiUrl, couponId),
    undefined,
    'GET',
    undefined,
    undefined,
    undefined,
    defaultRetryPolicy
  );
  if (apiResponse.ok) {
    const couponResponse: ICouponResponse = await apiResponse.json();
    return couponResponse;
  }
  const error: IPlatformApiError = await apiResponse.json();
  return { errorCode: apiResponse.status, message: error.title };
}

export function buildCouponLookupUrl(contentApi: string, couponId: string) {
  return `${contentApi}/coupons/${couponId}`;
}
