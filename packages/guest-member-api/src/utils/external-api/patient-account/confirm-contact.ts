// Copyright 2022 Prescryptive Health, Inc.

import { gearsAccountAuthPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export interface IConfirmContactProps {
  contactHash: string;
  contactValue: string;
  confirmationCode: string;
  source: string;
}

export interface IConfirmContactResponse {
  contactHash: string;
  contactType: string;
  lastVerificationInfo: {
    createdOn: string;
    expiresOn: string;
  };
  isVerified: boolean;
  isDisabled: boolean;
}

export const confirmContact = async (
  configuration: IConfiguration,
  confirmContactProps: IConfirmContactProps
): Promise<IConfirmContactResponse> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildConfirmContactUrl(
      configuration.platformGearsApiUrl,
      confirmContactProps.contactHash
    ),
    confirmContactProps,
    'PUT',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    undefined
  );

  if (!apiResponse.ok) {
    const { status, statusText } = apiResponse;
    throw new EndpointError(status, statusText);
  }

  return (await apiResponse.json()) as IConfirmContactResponse;
};

const buildConfirmContactUrl = (
  platformGearsApiUrl: string,
  contactHash: string
) =>
  `${platformGearsApiUrl}${gearsAccountAuthPath}/contact/${contactHash}/confirm`;
