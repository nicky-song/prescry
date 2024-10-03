// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { generateBearerToken } from '../../controllers/provider-location/helpers/oauth-api-helper';
import { mockProviderDetails } from '../../mock-data/provider-details.mock';
import { IPharmacyPortalEndpointError } from '../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../get-data-from-url';
import { getProviderDetailsByProviderName } from './get-provider-details-by-provider-name';

jest.mock('../../controllers/provider-location/helpers/oauth-api-helper');
const generateBearerTokenMock = generateBearerToken as jest.Mock;

jest.mock('../get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const configurationMock = {
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'https://pharmacy-url',
} as IConfiguration;

describe('getProviderDetailsByProviderName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    generateBearerTokenMock.mockResolvedValue('token');
  });

  it('makes expected api request and return filtered response if success when provider name is passed', async () => {
    const providerNameMock = 'mock-provider-name';

    getDataFromUrlMock.mockResolvedValue({
      json: () => mockProviderDetails,
      ok: true,
    });

    const result = await getProviderDetailsByProviderName(
      configurationMock,
      providerNameMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      `https://pharmacy-url/providers/${providerNameMock}`,
      null,
      'GET',
      { Authorization: 'Bearer token' }
    );

    expect(result).toEqual({
      providerDetails: mockProviderDetails,
      message: 'success',
    });
  });

  it('makes expected api request and return error code if failure', async () => {
    const providerNameMock = 'mock-provider-name';
    const mockEndpointError: IPharmacyPortalEndpointError = {
      message: 'mock-error',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockEndpointError,
      ok: false,
      status: 500,
    });

    const result = await getProviderDetailsByProviderName(
      configurationMock,
      providerNameMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      `https://pharmacy-url/providers/${providerNameMock}`,
      null,
      'GET',
      { Authorization: 'Bearer token' }
    );
    expect(result).toEqual({
      errorCode: 500,
      message: 'mock-error',
    });
  });
});
