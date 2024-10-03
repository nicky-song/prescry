// Copyright 2020 Prescryptive Health, Inc.

export type ProviderLocationsActionKeys = 'PROVIDER_LOCATIONS_RESPONSE';

export interface IProviderLocationsAction<
  T extends ProviderLocationsActionKeys,
  P
> {
  type: T;
  payload: P;
}
