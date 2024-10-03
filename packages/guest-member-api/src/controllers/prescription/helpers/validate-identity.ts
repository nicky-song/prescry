// Copyright 2023 Prescryptive Health, Inc.

import {
  gearsValidateIdentityPath,
  IConfiguration,
} from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { IValidateIdentityRequest } from '@phx/common/src/models/air/validate-identity.request';
import { IValidateIdentity } from '@phx/common/src/models/air/validate-identity.response';
import { getDataFromUrlWithAuth0Mock } from '../../../utils/get-data-from-url-with-auth0.mock';

export const validateIdentity = async (
  configuration: IConfiguration,
  validateIdentityRequest: IValidateIdentityRequest
): Promise<IValidateIdentity> => {
  const { firstName, lastName, dateOfBirth, smartContractAddress } =
    validateIdentityRequest;
  const apiResponse = await getDataFromUrlWithAuth0Mock(
    'identity',
    configuration.auth0,
    buildValidateIdentityUrl(
      configuration.platformGearsApiUrl,
      smartContractAddress
    ),
    {
      firstName,
      lastName,
      dateOfBirth,
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
    const errorResponse: IValidateIdentity = await apiResponse.json();
    throw new EndpointError(apiResponse.status, errorResponse?.error);
  }

  const mockResult: IValidateIdentity = {
    success: true,
    error: '',
  };

  return mockResult;
};

const buildValidateIdentityUrl = (
  platformGearsApiUrl: string,
  smartContractAddress: string
) => `${platformGearsApiUrl}${gearsValidateIdentityPath(smartContractAddress)}`;
