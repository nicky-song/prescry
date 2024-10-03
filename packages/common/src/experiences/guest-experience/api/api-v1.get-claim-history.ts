// Copyright 2022 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IClaimHistoryResponse } from '../../../models/api-response/claim-history.response';
import { IClaim } from '../../../models/claim';
import { ErrorConstants } from '../../../theming/constants';
import {
  IApiConfig,
  buildUrl,
  buildCommonHeaders,
  call,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { handleHttpErrors, APITypes } from './api-v1-helper';
import { ensureGetClaimHistoryResponse } from './ensure-api-response/ensure-claim-history.response';
import { withRefreshToken } from './with-refresh-token';

export const getClaimHistory = async (
  apiConfig: IApiConfig,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IClaimHistoryResponse> => {
  const url = buildUrl(apiConfig, 'claimHistory', {});

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();

  if (response.ok && ensureGetClaimHistoryResponse(responseJson)) {
    const covertedResponseJson: IClaimHistoryResponse = {
      ...responseJson,
      data: {
        ...responseJson.data,
        claims: responseJson.data.claims.map((claim: IClaim) => ({
          ...claim,
          filledOn: claim.filledOn ? new Date(claim.filledOn) : undefined,
        })),
      },
    };
    return withRefreshToken<IClaimHistoryResponse>(
      covertedResponseJson,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingClaimHistory,
    APITypes.GET_CLAIM_HISTORY,
    errorResponse.code,
    errorResponse
  );
};
