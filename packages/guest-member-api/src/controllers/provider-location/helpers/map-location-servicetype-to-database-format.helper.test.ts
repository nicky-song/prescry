// Copyright 2021 Prescryptive Health, Inc.

import { IService } from '@phx/common/src/models/provider-location';
import {
  providerLocationEndpointResponseMock,
  providerLocationResponseWithServiceTypeFilterMock,
} from '../../../mock-data/provider-location.mock';
import { IServices } from '../../../models/services';
import {
  mapProviderLocationEndpointResponseToDBLocation,
  mapProviderLocationEndPointResponseToLocationServiceDetails,
  mapProviderLocationEndPointResponseToServicesCollectionFields,
} from './map-location-servicetype-to-database-format.helper';

describe('map Provider Location Endpoint Response to Location', () => {
  it('should map values correctly', () => {
    const result = mapProviderLocationEndpointResponseToDBLocation(
      providerLocationEndpointResponseMock
    );

    const expectedResult = {
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

    expect(result).toEqual(expectedResult);
  });
});

describe('map Provider Location Endpoint Response to serviceList in providerLocation collection', () => {
  it('should map values correctly', () => {
    const result: IService =
      mapProviderLocationEndPointResponseToLocationServiceDetails(
        providerLocationEndpointResponseMock.services[0]
      );
    const expectedResult = {
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

    expect(result).toEqual(expectedResult);
  });
});

describe('map Provider Location Endpoint Response to services collection', () => {
  it('should map values correctly', () => {
    const result: IServices =
      mapProviderLocationEndPointResponseToServicesCollectionFields(
        providerLocationEndpointResponseMock.services[0]
      );
    expect(result).toEqual(
      providerLocationResponseWithServiceTypeFilterMock.service
    );
  });
});
