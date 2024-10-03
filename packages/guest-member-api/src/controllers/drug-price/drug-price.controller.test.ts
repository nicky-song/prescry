// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { searchPharmacyDrugPriceHandler } from './handlers/search-pharmacy-drug-price.handler';
import { DrugPriceController } from './drug-price.controller';
import { configurationMock } from '../../mock-data/configuration.mock';
import { alternativeDrugPriceHandler } from './handlers/alternative-drug-price.handler';

jest.mock('./handlers/alternative-drug-price.handler');
const alternativeDrugPriceHandlerMock =
  alternativeDrugPriceHandler as jest.Mock;

jest.mock('./handlers/search-pharmacy-drug-price.handler');
const searchPharmacyDrugPriceHandlerMock =
  searchPharmacyDrugPriceHandler as jest.Mock;

describe('DrugPriceController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    searchPharmacyDrugPriceHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const drugPriceController = new DrugPriceController(configurationMock);
    expect(drugPriceController.searchPharmacyDrugPrices).toBeDefined();
  });

  it('should call searchPharmacyDrugPriceHandler for searchPharmacyDrugPrices', async () => {
    const routeHandler = new DrugPriceController(configurationMock)
      .searchPharmacyDrugPrices;
    await routeHandler(requestMock, routerResponseMock);
    expect(searchPharmacyDrugPriceHandlerMock).toBeCalledTimes(1);

    expect(searchPharmacyDrugPriceHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });

  it('should call alternativeDrugPriceHandler for searchAlternativeDrugPrices', async () => {
    const routeHandler = new DrugPriceController(configurationMock)
      .searchAlternativeDrugPrices;
    await routeHandler(requestMock, routerResponseMock);

    expect(alternativeDrugPriceHandlerMock).toBeCalledTimes(1);
    expect(alternativeDrugPriceHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
});
