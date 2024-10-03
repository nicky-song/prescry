// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPlatformApiError } from '../../models/platform/platform-api-error.response';
import { ICoupon } from '../../models/coupon';
import { getDataFromUrl } from '../get-data-from-url';
import { defaultRetryPolicy } from '../fetch-retry.helper';

export interface ICouponResponse {
  coupon?: ICoupon;
  errorCode?: number;
  message?: string;
}

export async function getCouponByNdcAndQuantity(
  ndc: string,
  quantity: number,
  configuration: IConfiguration
): Promise<ICouponResponse> {
  try {
    const apiResponse = await getDataFromUrl(
      buildCouponLookupUrl(configuration.contentApiUrl, ndc, quantity),
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      defaultRetryPolicy
    );
    if (apiResponse.ok) {
      const result: ICoupon = await apiResponse.json();
      if (result.ProductId) {
        const couponResponse: ICouponResponse = { coupon: result };
        return couponResponse;
      }
      return {};
    }
    const error: IPlatformApiError = await apiResponse.json();
    const response: ICouponResponse = {
      errorCode: apiResponse.status,
      message: error.title,
    };
    return response;
  } catch {
    return {
      errorCode: 500,
      message: 'error',
    };
  }
}

export function buildCouponLookupUrl(
  contentApi: string,
  ndc: string,
  quantity: number
) {
  return `${contentApi}/coupons/${ndc}?quantity=${quantity}`;
}
