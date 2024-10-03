// Copyright 2022 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IFavoritedPharmacyResponse } from '../../../models/api-response/favorited-pharmacy-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  IApiConfig,
  buildUrl,
  buildCommonHeaders,
  call,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { handleHttpErrors, APITypes } from './api-v1-helper';
import { ensureGetFavoritedPharmacyResponse } from './ensure-api-response/ensure-get-favorited-pharmacy-response';
import { withRefreshToken } from './with-refresh-token';

export const getFavoritedPharmacies = async (
  config: IApiConfig,
  token?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IFavoritedPharmacyResponse> => {
  const url = buildUrl(config, 'favoritedPharmacies', {});

  const response: Response = await call(
    url,
    null,
    'GET',
    buildCommonHeaders(config, token, deviceToken),
    retryPolicy
  );
  const responseJson = await response.json();

  if (response.ok) {
    const favoritedPharmacyResponse = ensureGetFavoritedPharmacyResponse(
      responseJson,
      url
    );

    return withRefreshToken<IFavoritedPharmacyResponse>(
      favoritedPharmacyResponse,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGetFavoritedPharmacies,
    APITypes.GET_FAVORITED_PHARMACIES,
    errorResponse.code,
    errorResponse
  );
};
