// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration, gearsCoveragePath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import {
  ICoverage,
  ICoverageErrorResponse,
} from '../../../models/fhir/patient-coverage/coverage';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const createCoverage = async (
  configuration: IConfiguration,
  coverage: ICoverage
): Promise<void> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildCreateCoverageUrl(configuration.platformGearsApiUrl),
    coverage,
    'POST',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
      'Content-Type': 'application/fhir+json',
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    undefined
  );

  if (!apiResponse.ok) {
    const errorResponse: ICoverageErrorResponse = await apiResponse.json();

    throw new EndpointError(
      apiResponse.status,
      errorResponse?.error || errorResponse?.title
    );
  }
};

const buildCreateCoverageUrl = (platformGearsApiUrl: string) =>
  `${platformGearsApiUrl}${gearsCoveragePath}`;
