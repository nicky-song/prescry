// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IImmunizationRecordResponse } from '../../../models/api-response/immunization-record-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureImmunizationRecordResponse } from './ensure-api-response/ensure-immunization-record-response';
import { withRefreshToken } from './with-refresh-token';

export const getImmunizationRecordDetails = async (
  config: IApiConfig,
  orderNumber: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IImmunizationRecordResponse> => {
  const url = buildUrl(config, 'immunizationRecord', { ':id': orderNumber });
  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureImmunizationRecordResponse(responseJson)) {
    return withRefreshToken<IImmunizationRecordResponse>(
      responseJson,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingImmunizationRecordDetails,
    APITypes.IMMUNIZATION_RECORD_DETAILS,
    errorResponse.code,
    errorResponse
  );
};
