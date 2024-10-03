// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { ILocationCoordinates } from '../location-coordinates';

export type IGeolocationResponse = IApiDataResponse<IGeolocationResponseData>;

export interface IGeolocationResponseData {
  location: ILocationCoordinates;
}

export type IGeolocationAutocompleteResponse =
  IApiDataResponse<IGeolocationAutocompleteResponseData>;

export interface IGeolocationAutocompleteResponseData {
  locations: ILocationCoordinates[];
}

export interface IGetByQueryHelperResponse {
  locations?: ILocationCoordinates[];
  errorCode?: number;
  message?: string;
}

export interface ILocationResponse {
  location?: ILocationCoordinates;
  errorCode?: number;
  message?: string;
}
