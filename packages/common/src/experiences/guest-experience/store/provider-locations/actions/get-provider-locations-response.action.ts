// Copyright 2020 Prescryptive Health, Inc.

import { IProviderLocationDetails } from '../../../../../models/api-response/provider-location-response';
import { IProviderLocationsAction } from './provider-locations-action';

export type IGetProviderLocationsResponseAction = IProviderLocationsAction<
  'PROVIDER_LOCATIONS_RESPONSE',
  IProviderLocationDetails[]
>;

export const getProviderLocationsResponseAction = (
  providerLocationResponseData: IProviderLocationDetails[]
): IGetProviderLocationsResponseAction => ({
  payload: providerLocationResponseData,
  type: 'PROVIDER_LOCATIONS_RESPONSE',
});
