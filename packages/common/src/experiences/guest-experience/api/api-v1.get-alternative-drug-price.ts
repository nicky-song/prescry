// Copyright 2022 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IAlternativeDrugPriceSearchResponse } from '../../../models/api-response/alternative-drug-price.response';
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

export const getAlternativeDrugPrice = async (
  apiConfig: IApiConfig,
  ndc: string,
  ncpdp: string,
  token?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IAlternativeDrugPriceSearchResponse> => {
  const url = buildUrl(apiConfig, 'searchAlternativeDrugPrice', {
    ':ndc': ndc,
    ':ncpdp': ncpdp,
  });

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig, token, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();

  if (response.ok && ensureGetPrescriptionPharmaciesResponse(responseJson)) {
    const searchResponse = responseJson as IAlternativeDrugPriceSearchResponse;

    return withRefreshToken<IAlternativeDrugPriceSearchResponse>(
      searchResponse,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingAlternativeDrugPrices,
    APITypes.GET_ALTERNATIVE_DRUG_PRICE,
    errorResponse.code,
    errorResponse
  );
};
