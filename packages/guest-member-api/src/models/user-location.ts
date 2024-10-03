// Copyright 2021 Prescryptive Health, Inc.

export interface IUserLocation {
  zipCode: string;
  distance: number;
  city: string;
  state: string;
  coordinates: IGeolocationRequestBody;
}

export interface IGeolocationRequestBody {
  longitude: number;
  latitude: number;
}
