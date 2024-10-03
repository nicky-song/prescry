// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { IUpdateLanguageCodeRequestBody } from '../../../models/api-request-body/update-language-code.request-body';
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
import { ensureUpdateLanguageCodeResponse } from './ensure-api-response/ensure-update-language-code-response';
import { withRefreshToken } from './with-refresh-token';

export const updateLanguageCode = async (
  config: IApiConfig,
  updateLanguageCodeRequestBody: IUpdateLanguageCodeRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'languageCode', {});

  const response: Response = await call(
    url,
    updateLanguageCodeRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureUpdateLanguageCodeResponse(responseJson, url)) {
    return withRefreshToken<IApiResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;

  throw handleHttpErrors(
    HttpStatusCodes.NOT_FOUND,
    ErrorConstants.errorForUpdateLanguageCode,
    APITypes.UPDATE_LANGUAGE_CODE,
    errorResponse.code,
    errorResponse
  );
};
