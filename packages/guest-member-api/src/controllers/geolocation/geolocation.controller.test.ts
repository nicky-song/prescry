// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { GeolocationController } from './geolocation.controller';
import { getGeolocationHandler } from './handlers/get-geolocation.handler';
import { getGeolocationPharmaciesHandler } from './handlers/get-geolocation-pharmacies.handler';
import { getGeolocationAutocompleteHandler } from './handlers/get-geolocation-autocomplete.handler';
import { configurationMock } from '../../mock-data/configuration.mock';

jest.mock('./handlers/get-geolocation.handler');
const getGeolocationHandlerMock = getGeolocationHandler as jest.Mock;

jest.mock('./handlers/get-geolocation-pharmacies.handler');
const getGeolocationPharmaciesHandlerMock =
  getGeolocationPharmaciesHandler as jest.Mock;

jest.mock('./handlers/get-geolocation-autocomplete.handler');
const getGeolocationAutocompleteHandlerMock =
  getGeolocationAutocompleteHandler as jest.Mock;

describe('GeolocationController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    getGeolocationHandlerMock.mockReset();
  });

  it('should call getGeolocationHandler handler for getGeolocation Route', async () => {
    const routeHandler = new GeolocationController(configurationMock)
      .getGeolocation;
    await routeHandler(requestMock, routerResponseMock);
    expect(getGeolocationHandlerMock).toBeCalledTimes(1);

    expect(getGeolocationHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });

  it('should call getGeolocationPharmaciesHandler handler for getGeolocationPharmacies Route', async () => {
    const routeHandler = new GeolocationController(configurationMock)
      .getGeolocationPharmacies;
    await routeHandler(requestMock, routerResponseMock);
    expect(getGeolocationPharmaciesHandlerMock).toBeCalledTimes(1);

    expect(getGeolocationPharmaciesHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });

  it('should call getGeolocationAutocompleteHandler handler for getGeolocationAutocomplete Route', async () => {
    const routeHandler = new GeolocationController(configurationMock)
      .getGeolocationAutocomplete;
    await routeHandler(requestMock, routerResponseMock);
    expect(getGeolocationAutocompleteHandlerMock).toBeCalledTimes(1);

    expect(getGeolocationAutocompleteHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
});
