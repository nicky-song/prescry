// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { ICreateAccountResponse } from '../../../models/api-response/create-account.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import {
  APITypes,
  handleHttpErrors,
  handleTwilioHttpErrors,
} from './api-v1-helper';
import { ensureCreateAccountResponse } from './ensure-api-response/ensure-create-account.response';
import { ICreateAccountRequestBody } from '../../../models/api-request-body/create-account.request-body';
import { withRefreshToken } from './with-refresh-token';

export const createAccount = async (
  config: IApiConfig,
  createAccountRequestBody: ICreateAccountRequestBody
): Promise<ICreateAccountResponse> => {
  const url = buildUrl(config, 'createAccount', {});

  const response: Response = await call(
    url,
    createAccountRequestBody,
    'POST',
    buildCommonHeaders(config)
  );

  const responseJson = await response.json();
  if (response.ok && ensureCreateAccountResponse(responseJson)) {
    return withRefreshToken<ICreateAccountResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  const error = handleTwilioHttpErrors(
    response.status,
    APITypes.CREATE_ACCOUNT,
    errorResponse.code
  );
  if (error) {
    throw error;
  }

  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForCreateAccount,
    APITypes.CREATE_ACCOUNT,
    errorResponse.code,
    errorResponse
  );
};
