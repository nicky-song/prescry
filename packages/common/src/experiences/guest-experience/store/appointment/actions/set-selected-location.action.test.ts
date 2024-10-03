// Copyright 2020 Prescryptive Health, Inc.

import {
  ISetSelectedLocationActionType,
  setSelectedLocationAction,
} from './set-selected-location.action';
import { IServiceInfo } from '../../../../../models/api-response/provider-location-details-response';
import { ILocation } from '../../../../../models/api-response/provider-location-details-response';

describe('setSelectedLocationAction', () => {
  it('returns action', () => {
    const selectedService: IServiceInfo = {
      serviceName: 'test-service',
      serviceType: 'COVID-19 Antigen Testing',
      screenDescription: 'Test Desc',
      screenTitle: 'Test Title',
      questions: [],
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    };
    const selectedLocation: ILocation = {
      id: '1',
      providerName: 'Bartell Drugs',
      locationName: 'Bartell Drugs',
      address1: '7370 170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
      phoneNumber: '(425) 977-5489',
      serviceInfo: [selectedService],
      timezone: 'PDT',
    };
    const setLocationPayload: ISetSelectedLocationActionType = {
      selectedLocation,
      selectedService,
      minDate: '2020-07-20',
      maxDate: '2020-08-20',
    };

    const action = setSelectedLocationAction(setLocationPayload);
    expect(action.type).toEqual('APPOINTMENT_SET_SELECTED_LOCATION');
    expect(action.payload).toEqual(setLocationPayload);
  });
});
