// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { generateBearerToken } from '../../controllers/provider-location/helpers/oauth-api-helper';
import {
  IProviderDetails,
  IProviderDetailsResponse,
} from '../../models/pharmacy-portal/get-provider-details.response';
import { IPharmacyPortalEndpointError } from '../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../get-data-from-url';
import { Response } from 'node-fetch';

export async function getProviderDetailsByProviderName(
  configuration: IConfiguration,
  providerName: string | undefined
): Promise<IProviderDetailsResponse> {
  const token: string = await generateBearerToken(
    configuration.pharmacyPortalApiTenantId,
    configuration.pharmacyPortalApiClientId,
    configuration.pharmacyPortalApiClientSecret,
    configuration.pharmacyPortalApiScope
  );

  const apiResponse: Response = await getDataFromUrl(
    configuration.pharmacyPortalApiUrl + '/providers/' + providerName,
    null,
    'GET',
    {
      Authorization: `Bearer ${token}`,
    }
  );

  if (apiResponse.ok) {
    const providerDetailsObject: IProviderDetails = await apiResponse.json();
    return {
      providerDetails: providerDetailsObject,
      message: 'success',
    };
  }

  const apiError: IPharmacyPortalEndpointError = await apiResponse.json();

  return {
    errorCode: apiResponse.status,
    message: apiError.message,
  };
}
