// Copyright 2020 Prescryptive Health, Inc.

import { ILocation } from '@phx/common/src/models/api-response/provider-location-details-response';
import {
  IProviderLocation,
  IService,
} from '@phx/common/src/models/provider-location';
import { buildProviderLocationDetails } from './provider-location-details-map.helper';

describe('buildProviderLocation', () => {
  const distance = 10;

  const serviceListMock: IService[] = [
    {
      serviceName: 'service-name',
      serviceDescription: 'service-desc',
      questions: [],
      serviceType: 'COVID-19 Antigen Testing',
      screenTitle: 'screen1',
      screenDescription: 'screen-desc',
      confirmationDescription: 'confirm-desc',
      duration: 15,
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    },
  ];

  const providerLocationMock = {
    identifier: 'id-1',
    providerInfo: {
      providerName: 'provider',
    },
    locationName: 'test-location',
    address1: 'mock-address1',
    address2: 'mock-address2',
    city: 'mock-city',
    state: 'mock-state',
    zip: 'mock-zip',
    phoneNumber: 'mock-phone',
    timezone: 'America/Los_Angeles',
    serviceList: serviceListMock,
    regionName: 'Western Washington',
  } as unknown as IProviderLocation;

  it('Should return filtered document if distance and serviceType are present', () => {
    const providerLocationResponseMock = {
      id: 'id-1',
      providerName: 'provider',
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      distance: 10,
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      serviceInfo: [
        {
          serviceName: 'service-name',
          serviceType: 'COVID-19 Antigen Testing',
          questions: [],
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
          confirmationAdditionalInfo: undefined,
          paymentRequired: false,
        },
      ],
    } as ILocation;

    const providerResponse = buildProviderLocationDetails(
      providerLocationMock,
      serviceListMock[0],
      distance
    );
    expect(providerResponse).toStrictEqual(providerLocationResponseMock);
  });

  it('Should return 0 distance if no distance is present', () => {
    const providerLocationResponseMock = {
      id: 'id-1',
      providerName: 'provider',
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      distance: 0,
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      serviceInfo: [
        {
          serviceName: 'service-name',
          serviceType: 'COVID-19 Antigen Testing',
          questions: [],
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
          confirmationAdditionalInfo: undefined,
          paymentRequired: false,
        },
      ],
    } as ILocation;

    const providerResponse = buildProviderLocationDetails(
      providerLocationMock,
      serviceListMock[0]
    );
    expect(providerResponse).toStrictEqual(providerLocationResponseMock);
  });
});
