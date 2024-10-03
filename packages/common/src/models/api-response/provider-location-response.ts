// Copyright 2020 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type IProviderLocationResponse = IApiDataResponse<IProviderLocationData>;

export interface IProviderLocationData {
  locations: IProviderLocationDetails[];
  serviceNameMyRx?: string;
  minimumAge?: number;
}

export interface IProviderLocationDetails {
  id: string;
  providerName: string;
  locationName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  distance?: number;
  phoneNumber?: string;
  price?: string;
}
