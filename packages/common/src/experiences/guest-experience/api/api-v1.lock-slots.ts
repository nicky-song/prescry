// Copyright 2021 Prescryptive Health, Inc.

import { ILockSlotRequestBody } from '../../../models/api-request-body/lock-slot-request-body';
import { IFailureResponse } from '../../../models/api-response';
import { ILockSlotResponse } from '../../../models/api-response/lock-slot-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { withRefreshToken } from './with-refresh-token';

export const lockSlot = async (
  config: IApiConfig,
  lockSlotRequestBody: ILockSlotRequestBody,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<ILockSlotResponse> => {
  const url = buildUrl(config, 'lockSlot', {});

  const response: Response = await call(
    url,
    lockSlotRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();

  if (response.ok) {
    return withRefreshToken<ILockSlotResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForLockSlot,
    APITypes.LOCK_SLOT,
    errorResponse.code,
    errorResponse
  );
};
