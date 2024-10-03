// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { IFhir } from '../../../models/fhir/fhir';
import { ICoverage } from '../../../models/fhir/patient-coverage/coverage';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { findFhirCoverageResources } from '../../fhir/fhir-resource.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const getPatientCoverageByQuery = async (
  configuration: IConfiguration,
  query: string
): Promise<ICoverage[] | undefined> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildGetPatientCoverageUrl(configuration.platformGearsApiUrl),
    {
      query,
    },
    'POST',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
      'Content-Type': 'application/fhir+json',
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    const fhirResponse: IFhir = await apiResponse.json();

    const patientCoverages = findFhirCoverageResources(fhirResponse);

    return patientCoverages;
  }

  const message: string = await apiResponse.json();
  throw new EndpointError(apiResponse.status, message);
};

const buildGetPatientCoverageUrl = (platformGearsApiUrl: string) => {
  return `${platformGearsApiUrl}/eligibility/coverage/search`;
};
