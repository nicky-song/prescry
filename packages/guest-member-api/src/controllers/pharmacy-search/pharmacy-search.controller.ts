// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { pharmacySearchHandler } from './handlers/pharmacy-search.handler';

export class PharmacySearchController {
  public configuration: IConfiguration;
  constructor(configuration: IConfiguration) {
    this.configuration = configuration;
  }

  public searchPharmacies = async (request: Request, response: Response) =>
    await pharmacySearchHandler(request, response, this.configuration);
}
