// Copyright 2023 Prescryptive Health, Inc.

import { IAddConsentResponse } from '../../../../models/air/add-consent.response';
import { IFailureResponse } from '../../../../models/api-response';
import { ErrorConstants } from '../../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { ensureApiResponse } from '../ensure-api-response/ensure-api-response';
import { withRefreshToken } from '../with-refresh-token';

export const addConsent = async (
  apiConfig: IApiConfig,
  accountId: string,
  smartContractAddress: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  consent: boolean,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IAddConsentResponse> => {
  const url = buildUrl(apiConfig, 'verifyPatientInfo', {
    ':smartContractAddress': smartContractAddress,
  });

  const response: Response = await call(
    url,
    {
      accountId,
      smartContractAddress,
      firstName,
      lastName,
      dateOfBirth,
      consent,
    },
    'POST',
    buildCommonHeaders(apiConfig, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureApiResponse(responseJson)) {
    return withRefreshToken<IAddConsentResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorSendingPrescription,
    APITypes.VERIFY_PATIENT_INFO,
    errorResponse.code,
    errorResponse
  );
};
