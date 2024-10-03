// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { generateBearerToken } from '../../controllers/provider-location/helpers/oauth-api-helper';
import { IServiceTypeDetailsResponse } from '../../models/pharmacy-portal/get-service-by-service-type.response';
import { IPharmacyPortalEndpointError } from '../../models/pharmacy-portal/pharmacy-portal-error.response';
import { IServices } from '../../models/services';
import { getDataFromUrl } from '../get-data-from-url';
import { Response } from 'node-fetch';
import { defaultRetryPolicy } from '../fetch-retry.helper';

export async function getServiceDetailsByServiceType(
  configuration: IConfiguration,
  serviceType: string
): Promise<IServiceTypeDetailsResponse> {
  const token: string = await generateBearerToken(
    configuration.pharmacyPortalApiTenantId,
    configuration.pharmacyPortalApiClientId,
    configuration.pharmacyPortalApiClientSecret,
    configuration.pharmacyPortalApiScope
  );

  const apiResponse: Response = await getDataFromUrl(
    configuration.pharmacyPortalApiUrl + '/services/' + serviceType,
    null,
    'GET',
    {
      Authorization: `Bearer ${token}`,
    },
    undefined,
    undefined,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    const serviceTypeDetails: IServices = await apiResponse.json();
    return {
      service: serviceTypeDetails,
      message: 'success',
    };
  }

  const apiError: IPharmacyPortalEndpointError = await apiResponse.json();

  return {
    errorCode: apiResponse.status,
    message: apiError.message,
  };
}
