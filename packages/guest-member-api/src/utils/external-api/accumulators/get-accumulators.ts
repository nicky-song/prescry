// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';

export interface IAccumulatorsResponse {
  uniqueId: string;
  familyId: string;
  personCode: string;
  individualTotalDeductible: number;
  familyTotalDeductible: number;
  individualTotalOutOfPocket: number;
  familyTotalOutOfPocket: number;
}

export interface IGetAccumulatorsResponse {
  claimsAccumulators?: IAccumulatorsResponse;
}

export const getAccumulators = async (
  memberId: string,
  rxSubGroup: string,
  configuration: IConfiguration
): Promise<IGetAccumulatorsResponse> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'accumulators',
    configuration.auth0,
    buildGetClaimsAccumulatorsUrl(
      configuration.platformGearsApiUrl,
      memberId,
      rxSubGroup
    ),
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
    const claimsAccumulators: IAccumulatorsResponse = await apiResponse.json();
    return { claimsAccumulators };
  }

  if (apiResponse.status === HttpStatusCodes.NOT_FOUND) {
    return {};
  }

  const error: string = await apiResponse.json();
  throw new EndpointError(apiResponse.status, error);
};

const buildGetClaimsAccumulatorsUrl = (
  platformGearsApiUrl: string,
  memberId: string,
  rxSubGroup: string
) => {
  return `${platformGearsApiUrl}/accumulator/api/v1/accumulator/${rxSubGroup}/member/${memberId}/summary`;
};
