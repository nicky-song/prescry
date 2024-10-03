// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorFavoritingPharmacy } from '../../../errors/error-favoriting-pharmacy';
import { IUpdateFavoritedPharmaciesRequestBody } from '../../../models/api-request-body/update-favorited-pharmacies.request-body';
import { IApiResponse, IFailureResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureUpdateRecoveryEmailResponse } from './ensure-api-response/ensure-update-recovery-email-response';
import { withRefreshToken } from './with-refresh-token';

export const updateFavoritedPharmacies = async (
  config: IApiConfig,
  updateFavoritedPharmaciesRequestBody: IUpdateFavoritedPharmaciesRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'favoritedPharmacies', {});

  const response: Response = await call(
    url,
    updateFavoritedPharmaciesRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureUpdateRecoveryEmailResponse(responseJson)) {
    return withRefreshToken<IApiResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;

  if (response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
    const errorFavoritingPharmacy = new ErrorFavoritingPharmacy(
      ErrorConstants.errorForUpdateFavoritedPharmacies
    );
    throw errorFavoritingPharmacy;
  } else {
    throw handleHttpErrors(
      response.status,
      ErrorConstants.errorForUpdateFavoritedPharmacies,
      APITypes.UPDATE_FAVORITED_PHARMACIES,
      errorResponse.code,
      errorResponse
    );
  }
};
