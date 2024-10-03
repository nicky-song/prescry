// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import { createUnlockSlotEndpointHelper } from './unlock-slot-endpoint.helper';

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

const mockBookingError: IPharmacyPortalEndpointError = {
  message: 'mock-error',
};

describe('Create unlock slot endpoint helper', () => {
  beforeEach(() => {
    getDataFromUrlMock.mockReset();
    generateBearerTokenMock.mockReset();
    generateBearerTokenMock.mockResolvedValue('token');
  });

  const expectedUrl = 'https://pharmacy-url/provider/lock-slots';

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => {
        'success';
      },
      ok: true,
      status: 204,
    });

    const bookingId = 'bookingId';
    const result = await createUnlockSlotEndpointHelper(
      configurationMock,
      bookingId
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );

    expect(getDataFromUrlMock).toBeCalledWith(
      `${expectedUrl}/${bookingId}`,
      null,
      'DELETE',
      {
        Authorization: 'Bearer token',
      }
    );

    expect(result).toEqual({
      message: 'success',
    });
  });

  it('makes expected api request and return error code if failure', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockBookingError,
      ok: false,
      status: 500,
    });
    const bookingId = 'bookingId';
    const result = await createUnlockSlotEndpointHelper(
      configurationMock,
      bookingId
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );

    expect(getDataFromUrlMock).toBeCalledWith(
      `${expectedUrl}/${bookingId}`,
      null,
      'DELETE',
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
