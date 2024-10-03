// Copyright 2022 Prescryptive Health, Inc.

import { gearsAccountsPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import {
  IPatientAccount,
  IPatientAccountErrorResponse,
} from '../../../models/platform/patient-account/patient-account';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const getPatientAccountsByReference = async (
  configuration: IConfiguration,
  referenceField: string,
  includePatientDetails: boolean,
  retry: boolean
): Promise<IPatientAccount[]> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildGetPatientAccountByQueryUrl(
      configuration.platformGearsApiUrl,
      referenceField,
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
    const patientAccounts: IPatientAccount[] = await apiResponse.json();
    return patientAccounts;
  }

  const errorResponse: IPatientAccountErrorResponse = await apiResponse.json();
  throw new EndpointError(
    apiResponse.status,
    errorResponse?.error || errorResponse?.title
  );
};

const buildGetPatientAccountByQueryUrl = (
  platformGearsApiUrl: string,
  referenceField: string,
  withPatient: boolean
) => {
  const expandClause = withPatient ? '&expand=patient' : '';
  return `${platformGearsApiUrl}${gearsAccountsPath}/?sourceReference=${referenceField}${expandClause}`;
};
