// Copyright 2020 Prescryptive Health, Inc.

import { getProviderLocationsResponseAction } from './actions/get-provider-locations-response.action';
import {
  IProviderLocationsState,
  providerLocationsReducer,
} from './provider-locations.reducer';
import { IProviderLocationDetails } from '../../../../models/api-response/provider-location-response';

describe('providerLocationsReducer', () => {
  it('updates state for get response', () => {
    const locations: IProviderLocationDetails[] = [
      {
        id: '1',
        providerName: 'Bartell Drugs',
        locationName: 'Bartell Drugs',
        address1: '7370 170th Ave NE',
        city: 'Redmond',
        state: 'WA',
        zip: '98052',
        phoneNumber: '(425) 977-5489',
      },
    ];

    const action = getProviderLocationsResponseAction(locations);
    const expectedState: IProviderLocationsState = {
      providerLocations: locations,
    };

    const initialState: IProviderLocationsState = {
      providerLocations: [],
    };
    const updatedState = providerLocationsReducer(initialState, action);
    expect(updatedState).toEqual(expectedState);
  });
});
