// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../constants/api-constants';
import { IConfiguration } from '../../configuration';
import { getDataFromUrl } from '../get-data-from-url';
import { IPatientPriceRequest } from '../../models/platform/pharmacy-pricing-lookup.request';
import { IPharmacyPrice } from '../../models/platform/pharmacy-pricing-lookup.response';
import { defaultRetryPolicy } from '../fetch-retry.helper';

export interface IPharmacyPriceResponse {
  pharmacyPrices?: IPharmacyPrice[];
  errorCode?: number;
  message?: string;
}

export async function getPharmaciesPricesByNdc(
  pricingRequest: IPatientPriceRequest,
  configuration: IConfiguration
): Promise<IPharmacyPriceResponse> {
  const apiResponse = await getDataFromUrl(
    buildPriceLookupUrl(configuration.platformGearsApiUrl),
    pricingRequest,
    'POST',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    undefined,
    defaultRetryPolicy
  );
  if (apiResponse.ok) {
    const pharmacyPrices: IPharmacyPrice[] = await apiResponse.json();
    return { pharmacyPrices };
  }
  const error: string = await apiResponse.json();
  return { errorCode: apiResponse.status, message: error };
}

export function buildPriceLookupUrl(platformGearsApiUrl: string) {
  return `${platformGearsApiUrl}/pharmacypricing/getbestpharmacydrugprices`;
}
