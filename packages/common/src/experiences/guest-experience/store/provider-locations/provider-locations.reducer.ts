// Copyright 2020 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { IGetProviderLocationsResponseAction } from './actions/get-provider-locations-response.action';
import { IProviderLocationDetails } from '../../../../models/api-response/provider-location-response';

export interface IProviderLocationsState {
  readonly providerLocations: IProviderLocationDetails[];
}

export const defaultProviderLocationsState: IProviderLocationsState = {
  providerLocations: [],
};

export const providerLocationsReducer: Reducer<
  IProviderLocationsState,
  IGetProviderLocationsResponseAction
> = (
  state: IProviderLocationsState = defaultProviderLocationsState,
  action: IGetProviderLocationsResponseAction
) => {
  switch (action.type) {
    case 'PROVIDER_LOCATIONS_RESPONSE':
      return {
        ...state,
        providerLocations: action.payload,
      };
  }

  return state;
};
