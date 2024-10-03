// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IPharmacySearchResponse } from '../../../models/api-response/pharmacy-search.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureSearchPharmacyResponse } from './ensure-api-response/ensure-search-pharmacy-response';
import { withRefreshToken } from './with-refresh-token';

export const getPharmaciesByZipCode = async (
  apiConfig: IApiConfig,
  zipCode: string,
  isUnauthExperience: boolean,
  start?: string,
  token?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IPharmacySearchResponse> => {
  const url = buildUrl(
    apiConfig,
    isUnauthExperience ? 'searchPharmacy' : 'searchPharmacyAuth',
    {
      ':zipCode': zipCode,
      ':start': start || '0',
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
  if (response.ok && ensureSearchPharmacyResponse(responseJson)) {
    const searchResponse = responseJson as IPharmacySearchResponse;
    return withRefreshToken<IPharmacySearchResponse>(searchResponse, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingPharmacies(zipCode),
    APITypes.GET_PHARMACIES,
    errorResponse.code,
    errorResponse
  );
};
