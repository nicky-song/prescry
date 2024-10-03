// Copyright 2022 Prescryptive Health, Inc.

import { gearsPatientPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { IPatient } from '../../../models/fhir/patient/patient';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const updatePatientByMasterId = async (
  masterId: string,
  patient: IPatient,
  configuration: IConfiguration
): Promise<boolean> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildUpdatePatientUrl(configuration.platformGearsApiUrl, masterId),
    patient,
    'PUT',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    return true;
  }

  const message: string = await apiResponse.json();
  throw new EndpointError(apiResponse.status, message);
};

const buildUpdatePatientUrl = (
  platformGearsApiUrl: string,
  masterId: string
) => {
  return `${platformGearsApiUrl}${gearsPatientPath}/${masterId}`;
};
