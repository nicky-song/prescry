// Copyright 2022 Prescryptive Health, Inc.

import { gearsAccountsPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { EndpointError } from '../../../errors/endpoint.error';
import {
  IPatientAccount,
  IPatientAccountErrorResponse,
} from '../../../models/platform/patient-account/patient-account';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const getPatientAccountByAccountId = async (
  configuration: IConfiguration,
  accountId: string,
  includePatientDetails: boolean,
  retry: boolean
): Promise<IPatientAccount | undefined> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildGetPatientAccountUrl(
      configuration.platformGearsApiUrl,
      accountId,
      includePatientDetails
    ),
    undefined,
    'GET',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    retry ? defaultRetryPolicy : undefined
  );
  if (apiResponse.ok) {
    const patientAccount: IPatientAccount = await apiResponse.json();
    return patientAccount;
  }

  if (apiResponse.status === HttpStatusCodes.NOT_FOUND) {
    return undefined;
  }
  const errorResponse: IPatientAccountErrorResponse = await apiResponse.json();
  throw new EndpointError(
    apiResponse.status,
    errorResponse?.error || errorResponse?.message
  );
};

const buildGetPatientAccountUrl = (
  platformGearsApiUrl: string,
  accountId: string,
  withPatient: boolean
) => {
  if (withPatient) {
    return `${platformGearsApiUrl}${gearsAccountsPath}/${accountId}?expand=patient`;
  }
  return `${platformGearsApiUrl}${gearsAccountsPath}/${accountId}`;
};
