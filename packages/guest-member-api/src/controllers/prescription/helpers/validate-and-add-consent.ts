// Copyright 2023 Prescryptive Health, Inc.

import {
  gearsValidateAndAddConsentPath,
  IConfiguration,
} from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { IAddConsent } from '@phx/common/src/models/air/add-consent.response';
import { getDataFromUrlWithAuth0Mock } from '../../../utils/get-data-from-url-with-auth0.mock';
import { IValidateIdentityRequest } from '@phx/common/src/models/air/validate-identity.request';

export const validateAndAddConsent = async (
  configuration: IConfiguration,
  validateIdentityRequest: IValidateIdentityRequest
): Promise<IAddConsent> => {
  const {
    accountId,
    smartContractAddress,
    firstName,
    lastName,
    dateOfBirth,
    consent,
  } = validateIdentityRequest;

  const apiResponse = await getDataFromUrlWithAuth0Mock(
    'identity',
    configuration.auth0,
    buildAddConsentUrl(configuration.platformGearsApiUrl, smartContractAddress),
    {
      accountId,
      firstName,
      lastName,
      dateOfBirth,
      consent,
    },
    'POST',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    undefined
  );

  if (!apiResponse.ok) {
    const errorResponse: IAddConsent = await apiResponse.json();
    throw new EndpointError(apiResponse.status, errorResponse?.error);
  }

  const mockResult: IAddConsent = {
    success: true,
    error: '',
  };

  return mockResult;
};

const buildAddConsentUrl = (
  platformGearsApiUrl: string,
  smartContractAddress: string
) =>
  `${platformGearsApiUrl}${gearsValidateAndAddConsentPath(
    smartContractAddress
  )}`;
