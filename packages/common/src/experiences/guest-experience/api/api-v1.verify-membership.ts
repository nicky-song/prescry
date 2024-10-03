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
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { withRefreshToken } from './with-refresh-token';
import { IVerifyMembershipRequestBody } from '../../../models/api-request-body/verify-membership.request-body';
import { formatPhoneNumberForApi } from '../../../utils/formatters/phone-number.formatter';

export const verifyMembership = async (
  config: IApiConfig,
  verifyMembershipRequestBody: IVerifyMembershipRequestBody
): Promise<ICreateAccountResponse> => {
  const url = buildUrl(config, 'verifyMembership', {});

  const requestBody: IVerifyMembershipRequestBody = {
    ...verifyMembershipRequestBody,
    phoneNumber: formatPhoneNumberForApi(
      verifyMembershipRequestBody.phoneNumber
    ),
  };

  const response: Response = await call(
    url,
    requestBody,
    'POST',
    buildCommonHeaders(config)
  );

  const responseJson = await response.json();
  if (response.ok) {
    return withRefreshToken(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInVerifyingMembership,
    APITypes.VERIFY_MEMBERSHIP,
    errorResponse.code,
    errorResponse
  );
};
