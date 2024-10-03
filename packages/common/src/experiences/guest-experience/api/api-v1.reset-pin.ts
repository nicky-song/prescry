// Copyright 2021 Prescryptive Health, Inc.

import { IResetPinRequestBody } from '../../../models/api-request-body/reset-pin.request-body';
import { IFailureResponse } from '../../../models/api-response';
import { IResetPinResponse } from '../../../models/api-response/reset-pin.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureResetPinResponse } from './ensure-api-response/ensure-reset-pin-response';

export const resetPin = async (
  config: IApiConfig,
  resetPinRequestBody: IResetPinRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IResetPinResponse> => {
  const url = buildUrl(config, 'resetPin', {});

  const response: Response = await call(
    url,
    resetPinRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureResetPinResponse(responseJson)) {
    return responseJson;
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForResetPin,
    APITypes.RESET_PIN,
    errorResponse.code,
    errorResponse
  );
};
