// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { generateBearerToken } from '../../controllers/provider-location/helpers/oauth-api-helper';
import { mockServiceTypeDetails } from '../../mock-data/service-type-details.mock';
import { IPharmacyPortalEndpointError } from '../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../get-data-from-url';
import { getServiceDetailsByServiceType } from './get-service-details-by-service-type';

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

describe('getServiceDetailsByServiceType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    generateBearerTokenMock.mockResolvedValue('token');
  });

  it('makes expected api request and return filtered response if success when both locationId and servicetype are passed', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockServiceTypeDetails,
      ok: true,
    });

    const result = await getServiceDetailsByServiceType(
      configurationMock,
      'COVID-19 Antigen Testing'
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/services/COVID-19 Antigen Testing',
      null,
      'GET',
      { Authorization: 'Bearer token' },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(result).toEqual({
      service: mockServiceTypeDetails,
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

    const result = await getServiceDetailsByServiceType(
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
      'https://pharmacy-url/services/service-type',
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
});
