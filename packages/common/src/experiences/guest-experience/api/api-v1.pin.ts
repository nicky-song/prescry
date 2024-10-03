// Copyright 2018 Prescryptive Health, Inc.

import { InternalResponseCode } from '../../../errors/error-codes';
import {
  IAddPinResponse,
  IApiResponse,
  IFailureResponse,
  IPinVerificationFailureResponse,
  IVerifyPinResponse,
} from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import {
  EnsureAddPinResponse,
  EnsureVerifyPinResponse,
} from './ensure-api-response/ensure-api-response';
import { withRefreshToken } from './with-refresh-token';

export const addPin = async (
  config: IApiConfig,
  deviceToken: string,
  encryptedPin: string
): Promise<IAddPinResponse> => {
  const url = buildUrl(config, 'addPin', {});
  const data = {
    encryptedPin,
  };

  const response: Response = await call(
    url,
    data,
    'POST',
    buildCommonHeaders(config, undefined, deviceToken)
  );

  const responseJson = await response.json();
  if (response.ok && EnsureAddPinResponse(responseJson)) {
    return responseJson;
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForAddingPin,
    APITypes.ADD_PIN,
    errorResponse.code,
    errorResponse
  );
};

export const verifyPin = async (
  config: IApiConfig,
  deviceToken: string,
  encryptedPin: string
): Promise<IVerifyPinResponse> => {
  const url = buildUrl(config, 'verifyPin', {});
  const data = {
    encryptedPin,
  };

  const response: Response = await call(
    url,
    data,
    'POST',
    buildCommonHeaders(config, undefined, deviceToken)
  );

  const responseJson = await response.json();
  if (response.ok && EnsureVerifyPinResponse(responseJson)) {
    return responseJson;
  }

  const errorResponse = responseJson as IPinVerificationFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForVerifyingPin,
    APITypes.VERIFY_PIN,
    undefined,
    errorResponse
  );
};

export const updatePin = async (
  config: IApiConfig,
  token: string,
  deviceToken: string,
  encryptedPinCurrent: string,
  encryptedPinNew: string
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'updatePin', {});
  const data = {
    encryptedPinCurrent,
    encryptedPinNew,
  };

  const response: Response = await call(
    url,
    data,
    'POST',
    buildCommonHeaders(config, token, deviceToken)
  );

  const responseJson = await response.json();
  if (response.ok) {
    return withRefreshToken<IApiResponse>(
      responseJson as IApiResponse,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  if (errorResponse.code === InternalResponseCode.USE_ANOTHER_PIN) {
    throw errorResponse;
  }
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForUpdatingingPin,
    APITypes.UPDATE_PIN,
    errorResponse.code,
    errorResponse
  );
};
