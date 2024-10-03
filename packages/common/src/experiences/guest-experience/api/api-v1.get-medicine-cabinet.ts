// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IMedicineCabinetResponse } from '../../../models/api-response/medicine-cabinet.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  IApiConfig,
  buildUrl,
  buildCommonHeaders,
  call,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { handleHttpErrors, APITypes } from './api-v1-helper';
import { ensureGetMedicineCabinetResponse } from './ensure-api-response/ensure-medicine-cabinet.response';
import { withRefreshToken } from './with-refresh-token';

export const getMedicineCabinet = async (
  page: number,
  apiConfig: IApiConfig,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IMedicineCabinetResponse> => {
  const url = buildUrl(apiConfig, 'medicineCabinet', {});

  const response: Response = await call(
    `${url}?page=${page}`,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureGetMedicineCabinetResponse(responseJson)) {
    return withRefreshToken<IMedicineCabinetResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingMedicineCabinet,
    APITypes.GET_MEDICINE_CABINET,
    errorResponse.code,
    errorResponse
  );
};
