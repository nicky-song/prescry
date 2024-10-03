// Copyright 2021 Prescryptive Health, Inc.

import { ILockSlotRequestBody } from '@phx/common/src/models/api-request-body/lock-slot-request-body';
import { IConfiguration } from '../../../configuration';
import { ILockSlotResponse } from '../../../models/pharmacy-portal/lock-slot.response';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import { createLockSlotEndpointHelper } from './lock-slot-endpoint.helper';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

jest.mock('../helpers/oauth-api-helper');
const generateBearerTokenMock = generateBearerToken as jest.Mock;

const configurationMock = {
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'https://pharmacy-url',
} as IConfiguration;

const lockSlotRequestMock: ILockSlotRequestBody = {
  locationId: 'locationId',
  startDate: new Date(),
  serviceType: 'serviceType',
  customerPhoneNumber: 'customerPhoneNumber',
};

const lockSlotResponseMock: ILockSlotResponse = {
  bookingId: 'bookingId',
  slotExpirationDate: new Date(),
};

const mockBookingError: IPharmacyPortalEndpointError = {
  message: 'mock-error',
};

describe('Create lock slot endpoint helper', () => {
  beforeEach(() => {
    getDataFromUrlMock.mockReset();
    generateBearerTokenMock.mockReset();
    generateBearerTokenMock.mockResolvedValue('token');
  });

  const expectedUrl = 'https://pharmacy-url/provider/lock-slots';

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => lockSlotResponseMock,
      ok: true,
    });

    const result = await createLockSlotEndpointHelper(
      configurationMock,
      lockSlotRequestMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );

    expect(getDataFromUrlMock).toBeCalledWith(
      expectedUrl,
      lockSlotRequestMock,
      'POST',
      {
        Authorization: 'Bearer token',
      }
    );

    expect(result).toEqual({
      data: lockSlotResponseMock,
      message: 'success',
    });
  });

  it('makes expected api request and return error code if failure', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockBookingError,
      ok: false,
      status: 500,
    });

    const result = await createLockSlotEndpointHelper(
      configurationMock,
      lockSlotRequestMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );

    expect(getDataFromUrlMock).toBeCalledWith(
      expectedUrl,
      lockSlotRequestMock,
      'POST',
      {
        Authorization: 'Bearer token',
      }
    );

    expect(result).toEqual({
      errorCode: 500,
      message: 'mock-error',
    });
  });
});
