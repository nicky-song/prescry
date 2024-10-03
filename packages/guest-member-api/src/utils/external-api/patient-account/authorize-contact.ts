// Copyright 2022 Prescryptive Health, Inc.

import { gearsAccountAuthPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { IContactErrorResponse } from '../../../models/patient-account/auth/contact-error-response';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { IConfirmContactResponse } from './confirm-contact';

export type ContactType = 'phone' | 'email';

export interface IAuthorizeContactProps {
  contactType: ContactType;
  contact: string;
}

export const authorizeContact = async (
  configuration: IConfiguration,
  authorizeContactProps: IAuthorizeContactProps
): Promise<IConfirmContactResponse> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildAuthContactUrl(configuration.platformGearsApiUrl),
    authorizeContactProps,
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
    const errorResponse: IContactErrorResponse = await apiResponse.json();
    throw new EndpointError(apiResponse.status, errorResponse.error);
  }

  return (await apiResponse.json()) as IConfirmContactResponse;
};

const buildAuthContactUrl = (platformGearsApiUrl: string) =>
  `${platformGearsApiUrl}${gearsAccountAuthPath}/contact`;
