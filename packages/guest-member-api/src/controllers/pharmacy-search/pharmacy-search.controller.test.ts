// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { configurationMock } from '../../mock-data/configuration.mock';
import { pharmacySearchHandler } from './handlers/pharmacy-search.handler';
import { PharmacySearchController } from './pharmacy-search.controller';

jest.mock('./handlers/pharmacy-search.handler');

const routerResponseMock = {} as Response;
const requestMock = {} as Request;

const pharmacySearchHandlerMock = pharmacySearchHandler as jest.Mock;

describe('PharmacySearchController', () => {
  beforeEach(() => {
    pharmacySearchHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const drugPriceController = new PharmacySearchController(configurationMock);
    expect(drugPriceController.searchPharmacies).toBeDefined();
  });

  it('should call pharmacySearchHandler handler for searchPharmacies Route', async () => {
    const routeHandler = new PharmacySearchController(configurationMock)
      .searchPharmacies;
    await routeHandler(requestMock, routerResponseMock);
    expect(pharmacySearchHandlerMock).toBeCalledTimes(1);

    expect(pharmacySearchHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
});
