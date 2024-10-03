// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { IConfiguration } from '../../../configuration';
import { ICreateWaitListRequest } from '../../../models/pharmacy-portal/create-waitlist.request';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { ICreateWaitlist } from '../../../models/pharmacy-portal/create-waitlist.response';
import { createWaitlistEndpointHelper } from './create-waitlist-endpoint.helper';
import { ServiceTypes } from '@phx/common/src/models/provider-location';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

jest.mock('../../provider-location/helpers/oauth-api-helper');
const generateBearerTokenMock = generateBearerToken as jest.Mock;

const addedWaitlistMock: ICreateWaitlist = {
  serviceType: ServiceTypes.c19VaccineDose1,
  identifier: 'identifier',
  zipCode: '11111',
  maxMilesAway: 10,
  firstName: 'mock-first',
  lastName: 'mock-last',
  dateOfBirth: '2000-03-01',
  phoneNumber: 'mock-phone',
};

const configurationMock = {
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'https://pharmacy-url',
} as IConfiguration;

const createWaitlistReqMock: ICreateWaitListRequest = {
  serviceType: ServiceTypes.c19VaccineDose1,
  zipCode: '11111',
  maxMilesAway: 10,
  firstName: 'mock-first',
  lastName: 'mock-last',
  dateOfBirth: '2000-03-01',
  phoneNumber: 'mock-phone',
};
describe('createWaitlistEndpointHelper', () => {
  beforeEach(() => {
    getDataFromUrlMock.mockReset();
    generateBearerTokenMock.mockReset();
    generateBearerTokenMock.mockResolvedValue('token');
  });

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => addedWaitlistMock,
      ok: true,
    });

    const result = await createWaitlistEndpointHelper(
      configurationMock,
      createWaitlistReqMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/waitlist',
      createWaitlistReqMock,
      'POST',
      { Authorization: 'Bearer token' }
    );
    expect(result).toEqual({
      waitlist: addedWaitlistMock,
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

    const result = await createWaitlistEndpointHelper(
      configurationMock,
      createWaitlistReqMock
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/waitlist',
      createWaitlistReqMock,
      'POST',
      { Authorization: 'Bearer token' }
    );

    expect(result).toEqual({
      errorCode: 500,
      message: 'mock-error',
    });
  });
});
