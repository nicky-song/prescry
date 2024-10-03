// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { getDataFromUrl } from '../get-data-from-url';

import { generateSmartPriceToken } from './generate-smart-price-token';
import {
  ISmartPriceProviderPrice,
  ISmartPriceError,
} from '../../models/content/smart-price.response';
import { ISmartPriceLookupRequest } from '../../models/content/smart-price.request';
import { defaultRetryPolicy } from '../fetch-retry.helper';

export interface ISmartPriceLookupResponse {
  pharmacyPrices?: ISmartPriceProviderPrice[];
  errorCode?: number;
  message?: string;
}

export async function getSmartPriceByNdc(
  smartPriceRequest: ISmartPriceLookupRequest,
  ndc: string,
  configuration: IConfiguration
): Promise<ISmartPriceLookupResponse> {
  try {
    const token: string = await generateSmartPriceToken(
      configuration.contentApiUrl,
      configuration.contentApiSmartPriceUserName,
      configuration.contentApiSmartPricePassword
    );

    const apiResponse = await getDataFromUrl(
      buildSmartPriceLookupUrl(configuration.contentApiUrl, ndc),
      smartPriceRequest,
      'POST',
      {
        Authorization: `Bearer ${token}`,
      },
      undefined,
      undefined,
      defaultRetryPolicy
    );
    if (apiResponse.ok) {
      const pharmacyPrices: ISmartPriceProviderPrice[] =
        await apiResponse.json();
      return { pharmacyPrices };
    }
    const error: ISmartPriceError = await apiResponse.json();
    return {
      errorCode: apiResponse.status,
      message: `${error.error} : ${error.message}`,
    };
  } catch {
    return {
      errorCode: 500,
      message: 'error in smartprice API',
    };
  }
}

export function buildSmartPriceLookupUrl(contentApi: string, ndc: string) {
  return `${contentApi}/pricing-smart-prices/calculate/${ndc}/NDC/`;
}
