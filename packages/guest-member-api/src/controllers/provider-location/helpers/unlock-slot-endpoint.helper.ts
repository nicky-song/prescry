// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'node-fetch';
import { IConfiguration } from '../../../configuration';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';

export interface IUnlockSlotEndpointResponse {
  errorCode?: number;
  message: string;
}

export async function createUnlockSlotEndpointHelper(
  configuration: IConfiguration,
  bookingId: string
): Promise<IUnlockSlotEndpointResponse> {
  const token: string = await generateBearerToken(
    configuration.pharmacyPortalApiTenantId,
    configuration.pharmacyPortalApiClientId,
    configuration.pharmacyPortalApiClientSecret,
    configuration.pharmacyPortalApiScope
  );
  const unlockSlotEndpoint = `${configuration.pharmacyPortalApiUrl}/provider/lock-slots/${bookingId}`;
  const apiResponse: Response = await getDataFromUrl(
    unlockSlotEndpoint,
    null,
    'DELETE',
    { Authorization: `Bearer ${token}` }
  );
  if (apiResponse.ok) {
    return { message: 'success' };
  }

  const unlockSlotError: IPharmacyPortalEndpointError =
    await apiResponse.json();
  return {
    errorCode: apiResponse.status,
    message: unlockSlotError.message,
  };
}
