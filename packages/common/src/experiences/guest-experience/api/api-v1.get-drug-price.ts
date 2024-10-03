// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IPharmacyPriceSearchResponse } from '../../../models/api-response/pharmacy-price-search.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureGetPrescriptionPharmaciesResponse } from './ensure-api-response/ensure-get-prescription-pharmacies-response';
import { withRefreshToken } from './with-refresh-token';
import { ILocationCoordinates } from '../../../models/location-coordinates';

export const getDrugPrice = async (
  apiConfig: IApiConfig,
  location: ILocationCoordinates,
  sortBy: string,
  ndc: string,
  supply: number,
  quantity: number,
  isUnauthExperience: boolean,
  distance: number,
  token?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IPharmacyPriceSearchResponse> => {
  const url = buildUrl(
    apiConfig,
    isUnauthExperience ? 'searchDrugPrice' : 'searchDrugPriceAuth',
    {
      ':zipCode': location.zipCode ?? '',
      ':latitude': location.latitude ? location.latitude.toString() : '',
      ':longitude': location.longitude ? location.longitude.toString() : '',
      ':sortby': sortBy,
      ':ndc': ndc,
      ':supply': supply.toString(),
      ':quantity': quantity.toString(),
      ':distance': distance.toString(),
    }
  );
  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig, token, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureGetPrescriptionPharmaciesResponse(responseJson)) {
    const searchResponse = responseJson as IPharmacyPriceSearchResponse;

    return withRefreshToken<IPharmacyPriceSearchResponse>(
      searchResponse,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingPrescriptionPharmacies,
    APITypes.GET_PRESCRIPTION_PHARMACIES,
    errorResponse.code,
    errorResponse
  );
};
