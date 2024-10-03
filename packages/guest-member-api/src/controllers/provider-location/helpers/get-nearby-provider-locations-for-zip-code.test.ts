// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import { providerLocationListEndpointResponseMock } from '../../../mock-data/provider-location.mock';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { getNearbyProviderLocationsForZipCode } from './get-nearby-provider-locations-for-zip-code';

jest.mock('../helpers/oauth-api-helper');
const generateBearerTokenMock = generateBearerToken as jest.Mock;

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const configurationMock = {
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'https://pharmacy-url',
} as IConfiguration;

describe('getNearbyProviderLocationsForZipCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    generateBearerTokenMock.mockResolvedValue('token');
  });

  it('makes expected api request and return response if success when all parameters are passed', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => providerLocationListEndpointResponseMock,
      ok: true,
    });

    const result = await getNearbyProviderLocationsForZipCode(
      configurationMock,
      'service-type',
      false,
      100,
      '99999',
      1,
      20
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/locations/?serviceType=service-type&withinMiles=100&zipCode=99999&pageNumber=1&pageSize=20',
      null,
      'GET',
      { Authorization: 'Bearer token' },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(result).toEqual({
      locations: providerLocationListEndpointResponseMock.locations,
      message: 'success',
    });
  });

  it('makes expected api request and return response if success when no parameters are passed', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => providerLocationListEndpointResponseMock,
      ok: true,
    });

    const result = await getNearbyProviderLocationsForZipCode(
      configurationMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/locations/',
      null,
      'GET',
      { Authorization: 'Bearer token' },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(result).toEqual({
      locations: providerLocationListEndpointResponseMock.locations,
      message: 'success',
    });
  });

  it('makes expected api request and return error code if failure', async () => {
    const mockEndpointError: IPharmacyPortalEndpointError = {
      message: 'mock-error',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockEndpointError,
      ok: false,
      status: 500,
    });

    const result = await getNearbyProviderLocationsForZipCode(
      configurationMock,
      'service-type'
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/locations/?serviceType=service-type',
      null,
      'GET',
      { Authorization: 'Bearer token' },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(result).toEqual({
      errorCode: 500,
      message: 'mock-error',
    });
  });

  it.each([
    [100, undefined],
    [undefined, '11203'],
  ])(
    'returns error code and does not make api call if withinMiles is %p and zipCode is %p',
    async (withinMiles: number | undefined, zipCode: string | undefined) => {
      const mockEndpointError: IPharmacyPortalEndpointError = {
        message: 'mock-error',
      };
      getDataFromUrlMock.mockResolvedValue({
        json: () => mockEndpointError,
        ok: false,
        status: 500,
      });

      const result = await getNearbyProviderLocationsForZipCode(
        configurationMock,
        'service-type',
        false,
        withinMiles,
        zipCode
      );
      expect(generateBearerTokenMock).not.toBeCalled();
      expect(getDataFromUrlMock).not.toBeCalled();
      expect(result).toEqual({
        errorCode: 400,
        message: 'Missing zipCode or search range',
      });
    }
  );
});
