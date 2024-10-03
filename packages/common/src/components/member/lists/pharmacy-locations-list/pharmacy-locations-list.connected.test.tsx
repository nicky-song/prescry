// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import {
  IPharmacyLocationsListProps,
  IPharmacyLocationsDispatchProps,
} from './pharmacy-locations-list';
import {
  mapStateToProps,
  dispatchActions,
} from './pharmacy-locations-list.connected';
import { RootState } from '../../../../experiences/guest-experience/store/root-reducer';
import { IProviderLocationsState } from '../../../../experiences/guest-experience/store/provider-locations/provider-locations.reducer';
import { getProviderLocationsDataLoadingAsyncAction } from '../../../../experiences/guest-experience/store/provider-locations/async-actions/get-provider-locations-data-loading.async-action';
import { IProviderLocationDetails } from '../../../../models/api-response/provider-location-response';

const providerLocationsStore: IProviderLocationDetails[] = [
  {
    id: '5e6a23ad138c5d191c68c892',
    providerName: 'Bartell Drugs',
    locationName: 'Seattle',
    address1: '22054 188th Ave W',
    city: 'Seattle',
    state: 'WA',
    zip: '97610',
    phoneNumber: '(425) 937-2481',
  },
];

describe('PharmacyLocationsListConnected', () => {
  it('maps state to state values', () => {
    const customViewStyle: ViewStyle = { backgroundColor: 'red' };
    const ownProps = {
      viewStyle: customViewStyle,
      serviceType: 'service-type',
    };
    const providerLocationsState: IProviderLocationsState = {
      providerLocations: providerLocationsStore,
    };
    const initialState: RootState = {
      providerLocations: providerLocationsState,
      serviceType: {
        type: 'service-type',
      },
    } as RootState;

    const mappedProps: IPharmacyLocationsListProps = mapStateToProps(
      initialState,
      ownProps
    );

    const expectedProps: IPharmacyLocationsListProps = {
      pharmacyLocations: providerLocationsStore,
      viewStyle: customViewStyle,
      serviceType: 'service-type',
    };
    expect(mappedProps).toEqual(expectedProps);
  });

  it('maps dispatch actions', () => {
    const expectedActions: IPharmacyLocationsDispatchProps = {
      getProviderLocations: getProviderLocationsDataLoadingAsyncAction,
    };

    expect(dispatchActions).toEqual(expectedActions);
  });
});
