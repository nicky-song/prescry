// Copyright 2022 Prescryptive Health, Inc.

import { gearsAccountsPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import {
  IPatientAccount,
  IPatientAccountErrorResponse,
} from '../../../models/platform/patient-account/patient-account';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const createPatientAccount = async (
  configuration: IConfiguration,
  patientAccount: IPatientAccount
): Promise<IPatientAccount> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildCreatePatientAccountUrl(configuration.platformGearsApiUrl),
    patientAccount,
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
    const errorResponse: IPatientAccountErrorResponse =
      await apiResponse.json();
    throw new EndpointError(
      apiResponse.status,
      errorResponse?.error || errorResponse.title
    );
  }

  return (await apiResponse.json()) as IPatientAccount;
};

const buildCreatePatientAccountUrl = (platformGearsApiUrl: string) =>
  `${platformGearsApiUrl}${gearsAccountsPath}`;
