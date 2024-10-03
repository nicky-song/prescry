// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../constants/api-constants';
import { IConfiguration } from '../../configuration';
import { getDataFromUrl } from '../get-data-from-url';
import { IPrescriptionPharmacy } from '../../models/platform/pharmacy-lookup.response';
import { IPlatformApiError } from '../../models/platform/platform-api-error.response';
import { defaultRetryPolicy } from '../fetch-retry.helper';

export interface IPharmacySearchResponse {
  pharmacies?: IPrescriptionPharmacy[];
  errorCode?: number;
  message?: string;
}

export async function searchNearByPharmaciesForCoordinates(
  configuration: IConfiguration,
  latitude: number,
  longitude: number,
  distance: number,
  limit?: number
): Promise<IPharmacySearchResponse> {
  const apiResponse = await getDataFromUrl(
    buildZipCodeLookupUrl(
      configuration.platformGearsApiUrl,
      latitude,
      longitude,
      distance,
      limit || ApiConstants.MAX_NUM_PHARMACY_LIMIT
    ),
    undefined,
    'GET',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    undefined,
    defaultRetryPolicy
  );
  if (apiResponse.ok) {
    const pharmacies: IPrescriptionPharmacy[] = await apiResponse.json();
    return { pharmacies };
  }
  const error: IPlatformApiError = await apiResponse.json();
  return { errorCode: apiResponse.status, message: error.title };
}

function buildZipCodeLookupUrl(
  platformGearsApiUrl: string,
  latitude: number,
  longitude: number,
  distance: number,
  limit: number
) {
  return `${platformGearsApiUrl}/pharmacies/1.0/pharmacies/coordinates?latitude=${latitude}&longitude=${longitude}&radiusMiles=${distance}&maxResults=${limit}&excludeClosedDoorFacilities=true`;
}
