// Copyright 2020 Prescryptive Health, Inc.

import { getProviderLocationsResponseAction } from './get-provider-locations-response.action';
import { IProviderLocationDetails } from '../../../../../models/api-response/provider-location-response';

describe('getProviderLocationsResponseAction', () => {
  it('returns action', () => {
    const providerLocations: IProviderLocationDetails[] = [
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

    const action = getProviderLocationsResponseAction(providerLocations);
    expect(action.type).toEqual('PROVIDER_LOCATIONS_RESPONSE');
    expect(action.payload).toEqual(providerLocations);
  });
});
