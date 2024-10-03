// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'node-fetch';
import { buildUrlWithQueryParams } from '@phx/common/src/utils/api-helpers/build-url-with-queryparams';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { IConfiguration } from '../../../configuration';
import {
  IProviderLocationListResponse,
  IProviderLocationListEndpointResponse,
} from '../../../models/pharmacy-portal/get-provider-location.response';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';

export const getNearbyProviderLocationsForZipCode = async (
  configuration: IConfiguration,
  serviceType?: string,
  onlyTestLocations?: boolean,
  withinMiles?: number,
  zipCode?: string,
  pageNumber?: number,
  pageSize?: number
): Promise<IProviderLocationListResponse> => {
  if ((!!withinMiles && !zipCode) || (!!zipCode && !withinMiles)) {
    return {
      errorCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Missing zipCode or search range',
    };
  }

  const token: string = await generateBearerToken(
    configuration.pharmacyPortalApiTenantId,
    configuration.pharmacyPortalApiClientId,
    configuration.pharmacyPortalApiClientSecret,
    configuration.pharmacyPortalApiScope
  );

  const queryParams = {
    ...(serviceType && { serviceType }),
    ...(withinMiles && { withinMiles: withinMiles.toString() }),
    ...(zipCode && { zipCode }),
    ...(onlyTestLocations && {
      onlyTestLocations: onlyTestLocations.toString(),
    }),
    ...(pageNumber && { pageNumber: pageNumber.toString() }),
    ...(pageSize && { pageSize: pageSize.toString() }),
  };

  const targetUrl = buildUrlWithQueryParams(
    configuration.pharmacyPortalApiUrl + '/locations/',
    queryParams
  );

  const apiResponse: Response = await getDataFromUrl(
    targetUrl,
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
    const providerLocationListResponse: IProviderLocationListEndpointResponse =
      await apiResponse.json();

    return {
      locations: providerLocationListResponse.locations,
      message: 'success',
    };
  }
  const apiError: IPharmacyPortalEndpointError = await apiResponse.json();

  return {
    errorCode: apiResponse.status,
    message: apiError.message,
  };
};
