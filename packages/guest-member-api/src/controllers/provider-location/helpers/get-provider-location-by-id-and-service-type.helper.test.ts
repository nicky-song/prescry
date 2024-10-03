// Copyright 2021 Prescryptive Health, Inc.

import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { IConfiguration } from '../../../configuration';
import { providerLocationEndpointResponseMock } from '../../../mock-data/provider-location.mock';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import { getProviderLocationByIdAndServiceType } from './get-provider-location-by-id-and-service-type.helper';
import {
  mapProviderLocationEndpointResponseToDBLocation,
  mapProviderLocationEndPointResponseToLocationServiceDetails,
  mapProviderLocationEndPointResponseToServicesCollectionFields,
} from './map-location-servicetype-to-database-format.helper';

jest.mock('./map-location-servicetype-to-database-format.helper');
const mapProviderLocationEndpointResponseToDBLocationMock =
  mapProviderLocationEndpointResponseToDBLocation as jest.Mock;
const mapProviderLocationEndPointResponseToLocationServiceDetailsMock =
  mapProviderLocationEndPointResponseToLocationServiceDetails as jest.Mock;
const mapProviderLocationEndPointResponseToServicesCollectionFieldsMock =
  mapProviderLocationEndPointResponseToServicesCollectionFields as jest.Mock;

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

const mockProviderLocation = {
  identifier: 'id-1',
  providerInfo: {
    providerName: 'provider-name',
  },
  locationName: 'test-location',
  address1: 'mock-address1',
  address2: 'mock-address2',
  city: 'mock-city',
  state: 'mock-state',
  zip: 'mock-zip',
  phoneNumber: 'mock-phone',
  timezone: 'America/Los_Angeles',
  enabled: true,
  providerTaxId: 'provider-tax-id',
  latitude: 40.694214,
  longitude: -73.96529,
  isTest: false,
  cliaNumber: '00000000',
  npiNumber: '00000001',
};
const mockProviderLocationService1 = {
  serviceName: 'service-name-myrx',
  serviceDescription: 'service-desc',
  serviceType: 'COVID-19 Antigen Testing',
  questions: [],
  screenTitle: 'screen1',
  screenDescription: 'screen-desc',
  confirmationDescription: 'confirm-desc',
  confirmationAdditionalInfo: 'additional-info',
  duration: 15,
  minLeadDays: 'P6D',
  maxLeadDays: 'P30D',
  status: 'everyone',
};
const mockProviderLocationService2 = {
  serviceName: 'service-name2-myrx',
  serviceDescription: 'service-desc2',
  serviceType: 'Other Testing',
  questions: [],
  screenTitle: 'screen1',
  screenDescription: 'screen-desc',
  confirmationDescription: 'confirm-desc',
  confirmationAdditionalInfo: 'additional-info',
  duration: 15,
  minLeadDays: 'P6D',
  maxLeadDays: 'P30D',
  status: 'everyone',
};
const serviceFromServicesCollection = {
  serviceType: 'COVID-19 Antigen Testing',
  serviceName: 'service-name-myrx',
  nationalServiceQuestions: [],
  minimumAge: 3,
  schedulerMinimumAge: 18,
  confirmationDescriptionMyRx: 'confirm-desc',
  cancellationPolicyMyRx: 'cancellation policy text',
  aboutQuestionsDescriptionMyRx: 'primary person appointment text',
  aboutDependentDescriptionMyRx: 'dependent policy text',
  serviceDescription: 'service-desc',
  serviceNameMyRx: 'service-name-myrx',
};

describe('getProviderLocationByIdAndServiceType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    generateBearerTokenMock.mockResolvedValue('token');
    mapProviderLocationEndpointResponseToDBLocationMock.mockReturnValue(
      mockProviderLocation
    );
    mapProviderLocationEndPointResponseToLocationServiceDetailsMock.mockReturnValue(
      mockProviderLocationService1
    );
    mapProviderLocationEndPointResponseToServicesCollectionFieldsMock.mockReturnValue(
      serviceFromServicesCollection
    );
  });

  it('makes expected api request and return filtered response if success when both locationId and servicetype are passed', async () => {
    const providerLocationEndpointResponseWithServiceFilterMock = {
      ...providerLocationEndpointResponseMock,
      services: [
        {
          id: 'COVID-19 Antigen Testing',
          name: 'service-name',
          description: 'service-desc',
          questions: [],
          clientText: {
            serviceName: 'service-name-myrx',
            screenTitle: 'screen1',
            screenDescription: 'screen-desc',
            cancellationPolicy: 'cancellation policy text',
            aboutQuestionsDescription: 'primary person appointment text',
            aboutDependentDescription: 'dependent policy text',
            confirmationDescription: 'confirm-desc',
            confirmationAdditionalInfo: 'additional-info',
          },
          schedulerMinimumAge: 18,
          minimumAge: 3,
          duration: 15,
          minLeadDuration: 'P6D',
          maxLeadDuration: 'P30D',
          scheduleMode: 'everyone',
        },
      ],
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => providerLocationEndpointResponseWithServiceFilterMock,
      ok: true,
    });

    const result = await getProviderLocationByIdAndServiceType(
      configurationMock,
      'location-id',
      'COVID-19 Antigen Testing'
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/locations/location-id?serviceFilter=COVID-19 Antigen Testing',
      null,
      'GET',
      { Authorization: 'Bearer token' },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedLocation: IProviderLocation = {
      ...mockProviderLocation,
      serviceList: [mockProviderLocationService1],
    };
    expect(result).toEqual({
      location: expectedLocation,
      service: serviceFromServicesCollection,
      message: 'success',
    });
  });

  it('makes expected api request and return response if success when only locationId is passed', async () => {
    mapProviderLocationEndPointResponseToLocationServiceDetailsMock
      .mockReturnValueOnce(mockProviderLocationService1)
      .mockReturnValue(mockProviderLocationService2);
    getDataFromUrlMock.mockResolvedValue({
      json: () => providerLocationEndpointResponseMock,
      ok: true,
    });

    const result = await getProviderLocationByIdAndServiceType(
      configurationMock,
      'location-id'
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/locations/location-id',
      null,
      'GET',
      { Authorization: 'Bearer token' },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedLocation: IProviderLocation = {
      ...mockProviderLocation,
      serviceList: [mockProviderLocationService1, mockProviderLocationService2],
    };
    expect(result).toEqual({
      location: expectedLocation,
      service: undefined,
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

    const result = await getProviderLocationByIdAndServiceType(
      configurationMock,
      'location-id',
      'service-type'
    );
    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'https://pharmacy-url/locations/location-id?serviceFilter=service-type',
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
