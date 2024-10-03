// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'node-fetch';
import { ILockSlotRequestBody } from '@phx/common/src/models/api-request-body/lock-slot-request-body';
import { IConfiguration } from '../../../configuration';
import { ILockSlotResponse } from '../../../models/pharmacy-portal/lock-slot.response';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';

export interface ILockSlotEndpointResponse {
  data?: ILockSlotResponse;
  errorCode?: number;
  message: string;
}

export async function createLockSlotEndpointHelper(
  configuration: IConfiguration,
  lockSlotRequest: ILockSlotRequestBody
): Promise<ILockSlotEndpointResponse> {
  const token: string = await generateBearerToken(
    configuration.pharmacyPortalApiTenantId,
    configuration.pharmacyPortalApiClientId,
    configuration.pharmacyPortalApiClientSecret,
    configuration.pharmacyPortalApiScope
  );
  const apiResponse: Response = await getDataFromUrl(
    configuration.pharmacyPortalApiUrl + '/provider/lock-slots',
    lockSlotRequest,
    'POST',
    { Authorization: `Bearer ${token}` }
  );

  if (apiResponse.ok) {
    const lockSlotResponse: ILockSlotResponse = await apiResponse.json();
    return { data: lockSlotResponse, message: 'success' };
  }
  const lockSlotError: IPharmacyPortalEndpointError = await apiResponse.json();
  return {
    errorCode: apiResponse.status,
    message: lockSlotError.message,
  };
}
