// Copyright 2022 Prescryptive Health, Inc.

import { gearsPatientPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { IPatient } from '../../../models/fhir/patient/patient';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const getPatientByMasterId = async (
  masterId: string,
  configuration: IConfiguration
): Promise<IPatient> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildGetPatientUrl(configuration.platformGearsApiUrl, masterId),
    undefined,
    'GET',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    const patientResponse: IPatient = await apiResponse.json();
    return patientResponse;
  }

  const message: string = await apiResponse.json();
  throw new EndpointError(apiResponse.status, message);
};

const buildGetPatientUrl = (platformGearsApiUrl: string, masterId: string) => {
  return `${platformGearsApiUrl}${gearsPatientPath}/${masterId}?allTenants=true`;
};
