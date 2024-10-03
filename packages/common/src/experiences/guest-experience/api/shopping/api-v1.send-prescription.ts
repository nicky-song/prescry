// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionSendRequestBody } from '../../../../models/api-request-body/prescription-send.request-body';
import {
  IApiResponse,
  IFailureResponse,
} from '../../../../models/api-response';
import { ErrorConstants } from '../../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { ensureApiResponse } from '../ensure-api-response/ensure-api-response';
import { withRefreshToken } from '../with-refresh-token';

export const sendPrescription = async (
  apiConfig: IApiConfig,
  ncpdp: string,
  prescriptionId: string,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy,
  blockchain?: boolean
): Promise<IApiResponse> => {
  const additionalParams = '?blockchain=true';

  const url = buildUrl(
    apiConfig,
    'prescriptionSend',
    {},
    blockchain ? additionalParams : undefined
  );

  const body: IPrescriptionSendRequestBody = {
    identifier: prescriptionId,
    ncpdp,
  };

  const response: Response = await call(
    url,
    body,
    'POST',
    buildCommonHeaders(apiConfig, authToken, deviceToken),
    retryPolicy
  );
  const responseJson = await response.json();
  if (response.ok && ensureApiResponse(responseJson)) {
    return withRefreshToken<IApiResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorSendingPrescription,
    APITypes.SEND_PRESCRIPTION,
    errorResponse.code,
    errorResponse
  );
};
