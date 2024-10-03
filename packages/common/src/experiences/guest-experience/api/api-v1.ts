// Copyright 2018 Prescryptive Health, Inc.

import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../errors/error-codes';
import {
  IApiResponse,
  IFailureResponse,
  IGetPendingPrescriptionResponse,
  IMembersApiResponse,
  IVerifyOneTimePasswordV2,
  IVerifySsoResponse,
} from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { IUpdatedMemberInfo } from '../store/edit-member-profile/edit-member-profile-reducer.actions';
import { ILoginRequestBody } from '../../../models/api-request-body/login.request-body';
import { RequestHeaders } from './api-request-headers';
import {
  APITypes,
  handleHttpErrors,
  handleTwilioHttpErrors,
  IRedirectResponse,
} from './api-v1-helper';
import {
  EnsureGetMemberContactInfoResponse,
  EnsureGetPendingPrescriptionResponse,
  EnsureRedirectResponse,
  ensureVerifyOneTimePasswordResponse,
} from './ensure-api-response/ensure-api-response';
import { withRefreshToken } from './with-refresh-token';
import { ensureLoginResponse } from './ensure-api-response/ensure-login-response';

export async function getPendingPrescriptions(
  config: IApiConfig,
  identifier: string,
  authToken: string,
  deviceToken?: string
): Promise<IGetPendingPrescriptionResponse | IRedirectResponse> {
  const url = buildUrl(config, 'pendingPrescriptions', {
    ':id': identifier,
  });
  const headers = buildCommonHeaders(config, authToken, deviceToken);
  const response: Response = await call(url, undefined, 'GET', headers);

  const responseJson = await response.json();
  if (
    response.status === HttpStatusCodes.ACCEPTED &&
    EnsureRedirectResponse(responseJson)
  ) {
    return withRefreshToken<IGetPendingPrescriptionResponse>(
      responseJson,
      response
    );
  }

  if (response.ok) {
    const memberInfoRequestId = response.headers.get(
      RequestHeaders.memberInfoRequestId
    );

    const prescriptionInfoRequestId = response.headers.get(
      RequestHeaders.prescriptionInfoRequestId
    );

    const prescriptions = EnsureGetPendingPrescriptionResponse(
      responseJson,
      url
    );
    //TODO: hardcoding the type property till the API is ready
    prescriptions.data.pendingPrescriptionList.type = 'Price';
    return withRefreshToken<IGetPendingPrescriptionResponse>(
      {
        ...prescriptions,
        memberInfoRequestId,
        prescriptionInfoRequestId,
      } as IGetPendingPrescriptionResponse,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;

  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingPendingPrescriptions,
    APITypes.GET_PENDING_PRESCRIPTION,
    errorResponse.code,
    errorResponse
  );
}

export async function verifyOneTimePassword(
  config: IApiConfig,
  oneTimePasswordCode: string,
  phoneNumber: string,
  automationToken?: string
): Promise<IVerifyOneTimePasswordV2> {
  const url = buildUrl(config, 'verifyOneTimePassword', {});
  const data = {
    code: oneTimePasswordCode,
    phoneNumber,
  };
  let headers = buildCommonHeaders(config);

  if (automationToken) {
    headers = {
      [RequestHeaders.automationTokenRequestHeader]: automationToken,
      ...headers,
    };
  }
  const response: Response = await call(url, data, 'POST', headers);
  const responseJson = await response.json();

  if (response.ok) {
    return {
      ...ensureVerifyOneTimePasswordResponse(responseJson, url),
    } as IVerifyOneTimePasswordV2;
  }

  const errorResponse = responseJson as IFailureResponse;

  const error = handleTwilioHttpErrors(
    response.status,
    APITypes.VERIFY_ONE_TIME_PASSWORD,
    errorResponse.code
  );
  if (error) {
    throw error;
  }

  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorIncorrectCodeForPhoneVerification,
    APITypes.VERIFY_ONE_TIME_PASSWORD,
    errorResponse.code,
    errorResponse
  );
}

export async function loginExternalSso(config: IApiConfig, token: string) {
  const url = buildUrl(config, 'verifySsoJwt', {});
  const response = await call(url, { jwt_token: token }, 'POST');
  const responseJson = await response.json();

  if (response.ok && responseJson?.data?.deviceToken) {
    return responseJson as IVerifySsoResponse;
  } else if (
    responseJson?.code &&
    responseJson.code === InternalResponseCode.GENERAL_MIN_AGE_NOT_MET
  ) {
    return {
      responseCode: InternalResponseCode.GENERAL_MIN_AGE_NOT_MET,
      data: null,
    };
  }

  throw Error(responseJson);
}

export async function loginUser(
  config: IApiConfig,
  loginRequestBody: ILoginRequestBody,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
) {
  const url = buildUrl(config, 'login', {});
  const headers = buildCommonHeaders(config, undefined, deviceToken);
  const response: Response = await call(
    url,
    loginRequestBody,
    'POST',
    headers,
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok) {
    return ensureLoginResponse(responseJson);
  }

  const errorResponse = responseJson as IFailureResponse;

  const error = handleTwilioHttpErrors(
    response.status,
    APITypes.LOGIN,
    errorResponse.code
  );
  if (error) {
    throw error;
  }

  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInvalidMemberDetails(),
    APITypes.LOGIN,
    errorResponse.code,
    errorResponse
  );
}

export async function sendOneTimePassword(
  config: IApiConfig,
  phoneNumber?: string,
  automationToken?: string,
  isBlockchain?: boolean
) {
  const url = buildUrl(config, 'sendOneTimePassword', {});
  let headers = buildCommonHeaders(config);
  if (automationToken) {
    headers = {
      [RequestHeaders.automationTokenRequestHeader]: automationToken,
      ...headers,
    };
  }

  const response: Response = await call(
    url,
    { phoneNumber, isBlockchain },
    'POST',
    headers
  );

  const responseJson = await response.json();
  if (response.ok) {
    return responseJson as IApiResponse;
  }

  const errorResponse = responseJson as IFailureResponse;

  const error = handleTwilioHttpErrors(
    response.status,
    APITypes.SEND_ONE_TIME_PASSWORD,
    errorResponse.code
  );
  if (error) {
    throw error;
  }

  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInSendingOneTimePassword,
    APITypes.SEND_ONE_TIME_PASSWORD,
    errorResponse.code,
    errorResponse
  );
}

export async function getMemberContactInfo(
  config: IApiConfig,
  token?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IMembersApiResponse | IRedirectResponse> {
  const url = buildUrl(config, 'members', {});
  const response: Response = await call(
    url,
    null,
    'GET',
    buildCommonHeaders(config, token, deviceToken),
    retryPolicy
  );
  const responseJson = await response.json();
  if (
    response.status === HttpStatusCodes.ACCEPTED &&
    EnsureRedirectResponse(responseJson)
  ) {
    return withRefreshToken<IMembersApiResponse>(responseJson, response);
  }

  if (response.ok) {
    const contactInfo = EnsureGetMemberContactInfoResponse(responseJson, url);
    const memberInfoRequestId = response.headers.get(
      RequestHeaders.memberInfoRequestId
    );

    return withRefreshToken<IMembersApiResponse>(
      {
        ...contactInfo,
        memberInfoRequestId,
      } as IMembersApiResponse,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingMemberContactInfo,
    APITypes.GET_MEMBERS,
    errorResponse.code,
    errorResponse
  );
}

export const updateMemberContactInfo = async (
  config: IApiConfig,
  authToken: string,
  identifier: string,
  updatedMember: IUpdatedMemberInfo,
  deviceToken?: string
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'updateMember', {
    ':id': identifier,
  });
  const headers = buildCommonHeaders(config, authToken, deviceToken);
  const response: Response = await call(url, updatedMember, 'PUT', headers);
  const responseJson = await response.json();
  if (response.ok) {
    return withRefreshToken<IApiResponse>(
      responseJson as IApiResponse,
      response
    );
  }

  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInUpdatingMemberInfo,
    APITypes.UPDATE_MEMBER,
    responseJson.code,
    responseJson
  );
};
