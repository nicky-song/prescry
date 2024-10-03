// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../../models/api-response';
import { IPrescriptionUserStatusResponse } from '../../../../models/api-response/prescription-user-status-response';
import { ErrorConstants } from '../../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { ensurePrescriptionUserStatusResponse } from '../ensure-api-response/ensure-prescription-user-status-response';

export const getPrescriptionUserStatus = async (
  apiConfig: IApiConfig,
  prescriptionId: string,
  retryPolicy?: IRetryPolicy,
  blockchain?: boolean
): Promise<IPrescriptionUserStatusResponse> => {
  const additionalParams = '?blockchain=true';

  const url = buildUrl(
    apiConfig,
    'prescriptionUserStatus',
    {
      ':identifier': prescriptionId,
    },
    blockchain ? additionalParams : undefined
  );

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig),
    retryPolicy
  );
  const responseJson = await response.json();
  if (response.ok && ensurePrescriptionUserStatusResponse(responseJson)) {
    return responseJson;
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInGettingUserStatus,
    APITypes.GET_PRESCRIPTION_USER_STATUS,
    errorResponse.code,
    errorResponse
  );
};
