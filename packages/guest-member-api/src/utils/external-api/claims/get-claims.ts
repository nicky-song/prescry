// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { gearsClaimsPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export interface IClaimData {
  id: string;
  billing: {
    individualDeductibleAmount: number;
    individualMemberAmount: number;
  };
  claim: {
    dateProcessed: string;
    drugName: string;
    drugNDC: string;
    formCode: string;
    strength: string;
    quantity: number;
    refills: number;
    daysSupply: number;
  };
  pharmacy: {
    ncpdp: string;
    name: string;
    phoneNumber?: string;
  };
  practitioner: {
    id: string;
    name: string;
    phoneNumber: string;
  };
}

export interface IClaimsResponse {
  memberId: string;
  claimData: IClaimData[];
}

export interface IGetClaimsResponse {
  claims?: IClaimData[];
}

export const getClaims = async (
  memberId: string,
  rxSubGroup: string,
  configuration: IConfiguration
): Promise<IGetClaimsResponse> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'claims',
    configuration.auth0,
    buildGetClaimsUrl(configuration.platformGearsApiUrl, memberId, rxSubGroup),
    undefined,
    'GET',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
      [ApiConstants.VERSION_HEADER_KEY]: '1.0',
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    const claimsResponse: IClaimsResponse = await apiResponse.json();
    return { claims: claimsResponse.claimData };
  }

  if (apiResponse.status === HttpStatusCodes.NOT_FOUND) {
    return { claims: [] };
  }

  const message: string = await apiResponse.json();
  throw new EndpointError(apiResponse.status, message);
};

const buildGetClaimsUrl = (
  platformGearsApiUrl: string,
  memberId: string,
  rxSubGroup: string
) => {
  return `${platformGearsApiUrl}${gearsClaimsPath}/${rxSubGroup}/${memberId}`;
};
