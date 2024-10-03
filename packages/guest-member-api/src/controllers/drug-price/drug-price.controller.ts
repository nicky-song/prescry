// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { alternativeDrugPriceHandler } from './handlers/alternative-drug-price.handler';
import { searchPharmacyDrugPriceHandler } from './handlers/search-pharmacy-drug-price.handler';
export class DrugPriceController {
  public configuration: IConfiguration;
  constructor(configuration: IConfiguration) {
    this.configuration = configuration;
  }

  public searchPharmacyDrugPrices = async (
    request: Request,
    response: Response
  ) =>
    await searchPharmacyDrugPriceHandler(request, response, this.configuration);

  public searchAlternativeDrugPrices = async (
    request: Request,
    response: Response
  ) => await alternativeDrugPriceHandler(request, response, this.configuration);
}
