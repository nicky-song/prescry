// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'node-fetch';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { IConfiguration } from '../../../configuration';
import { ICreateWaitListRequest } from '../../../models/pharmacy-portal/create-waitlist.request';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import {
  ICreateWaitlist,
  ICreateWaitlistEndpointResponse,
} from '../../../models/pharmacy-portal/create-waitlist.response';

export async function createWaitlistEndpointHelper(
  configuration: IConfiguration,
  waitlist: ICreateWaitListRequest
): Promise<ICreateWaitlistEndpointResponse> {
  const token: string = await generateBearerToken(
    configuration.pharmacyPortalApiTenantId,
    configuration.pharmacyPortalApiClientId,
    configuration.pharmacyPortalApiClientSecret,
    configuration.pharmacyPortalApiScope
  );
  const apiResponse: Response = await getDataFromUrl(
    configuration.pharmacyPortalApiUrl + '/waitlist',
    waitlist,
    'POST',
    { Authorization: `Bearer ${token}` }
  );
  if (apiResponse.ok) {
    const createWaitListResponse: ICreateWaitlist = await apiResponse.json();
    return { waitlist: createWaitListResponse, message: 'success' };
  }

  const createWaitlistError: IPharmacyPortalEndpointError =
    await apiResponse.json();
  return {
    errorCode: apiResponse.status,
    message: createWaitlistError.message,
  };
}
