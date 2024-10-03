// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { Response } from 'node-fetch';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import {
  IProviderLocationEndpointResponse,
  IProviderLocationResponse,
  IProviderLocationService,
} from '../../../models/pharmacy-portal/get-provider-location.response';
import {
  mapProviderLocationEndpointResponseToDBLocation,
  mapProviderLocationEndPointResponseToLocationServiceDetails,
  mapProviderLocationEndPointResponseToServicesCollectionFields,
} from './map-location-servicetype-to-database-format.helper';
import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';

export async function getProviderLocationByIdAndServiceType(
  configuration: IConfiguration,
  locationId: string,
  serviceType?: string
): Promise<IProviderLocationResponse> {
  const token: string = await generateBearerToken(
    configuration.pharmacyPortalApiTenantId,
    configuration.pharmacyPortalApiClientId,
    configuration.pharmacyPortalApiClientSecret,
    configuration.pharmacyPortalApiScope
  );

  const query = serviceType
    ? locationId + '?serviceFilter=' + serviceType
    : locationId;

  const apiResponse: Response = await getDataFromUrl(
    configuration.pharmacyPortalApiUrl + '/locations/' + query,
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
    const providerLocationResponse: IProviderLocationEndpointResponse =
      await apiResponse.json();
    const location: IProviderLocation =
      mapProviderLocationEndpointResponseToDBLocation(providerLocationResponse);

    let relevantService: IProviderLocationService | undefined;

    if (serviceType) {
      relevantService = providerLocationResponse.services.find(
        (service) => service.id === serviceType
      );

      if (relevantService) {
        location.serviceList = [
          mapProviderLocationEndPointResponseToLocationServiceDetails(
            relevantService
          ),
        ];
      }
    } else {
      const mappedServices = providerLocationResponse.services.map(
        (service: IProviderLocationService) =>
          mapProviderLocationEndPointResponseToLocationServiceDetails(service)
      );
      location.serviceList = mappedServices;
    }

    const serviceFromServicesCollection = relevantService
      ? mapProviderLocationEndPointResponseToServicesCollectionFields(
          relevantService
        )
      : undefined;

    return {
      location,
      service: serviceFromServicesCollection,
      message: 'success',
    };
  }

  const apiError: IPharmacyPortalEndpointError = await apiResponse.json();

  return {
    errorCode: apiResponse.status,
    message: apiError.message,
  };
}
